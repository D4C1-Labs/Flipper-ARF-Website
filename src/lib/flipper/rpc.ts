/**
 * Flipper Zero RPC Client
 * Handles protobuf-based RPC communication over serial
 */
import { FlipperSerial } from "./serial";
import { encodeRequest, decodeResponse, PB_System } from "./protobuf";

export type LogFn = (msg: string) => void;
export type ProgressFn = (current: number, total: number) => void;

export class FlipperRPC {
  private serial: FlipperSerial;
  private commandId = 1;
  private responseBuffer = new Uint8Array(0);
  private pendingResolve: ((res: any) => void) | null = null;
  private pendingReject: ((err: Error) => void) | null = null;
  private pendingChunks: any[] = [];
  private log: LogFn;
  private sessionStarted = false;

  constructor(serial: FlipperSerial, log: LogFn) {
    this.serial = serial;
    this.log = log;
  }

  private handleData = (data: Uint8Array) => {
    // Append to buffer
    const newBuffer = new Uint8Array(this.responseBuffer.length + data.length);
    newBuffer.set(this.responseBuffer);
    newBuffer.set(data, this.responseBuffer.length);
    this.responseBuffer = newBuffer;

    // Try to parse responses
    this.tryParse();
  };

  private tryParse() {
    while (this.responseBuffer.length > 0) {
      const result = decodeResponse(this.responseBuffer);
      if (!result) break;

      const { response, bytesRead } = result;
      this.responseBuffer = this.responseBuffer.slice(bytesRead);

      // If response has more chunks coming
      if (response.hasNext) {
        this.pendingChunks.push(response);
        continue;
      }

      // Resolve the pending promise
      if (this.pendingResolve) {
        const allChunks = [...this.pendingChunks, response];
        this.pendingChunks = [];
        this.pendingResolve(allChunks);
        this.pendingResolve = null;
        this.pendingReject = null;
      }
    }
  }

  async connect(): Promise<string> {
    const deviceName = await this.serial.connect(this.handleData);
    return deviceName;
  }

  async startSession(): Promise<void> {
    if (this.sessionStarted) return;

    // Step 1: Clear any partial CLI input with a bare CR
    // IMPORTANT: Flipper expects \r only — NOT \r\n — to start RPC session
    await this.serial.writeString("\r");
    await this.sleep(300);

    // Clear any CLI echo/output buffered so far
    this.responseBuffer = new Uint8Array(0);

    // Step 2: Enter RPC mode — MUST use \r, NOT \r\n (Flipper rejects \r\n)
    await this.serial.writeString("start_rpc_session\r");

    // Step 3: Wait for the Flipper to acknowledge and switch to RPC mode.
    // The Flipper sends a \n when it has accepted the command and entered RPC mode.
    // We wait generously to make sure the response has arrived before clearing.
    await this.sleep(1500);

    // Clear all CLI text response (not protobuf, so discard it)
    this.responseBuffer = new Uint8Array(0);

    this.sessionStarted = true;
    this.log("[RPC] Session started");
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private nextCommandId(): number {
    return this.commandId++;
  }

  private async sendCommand(requestType: string, args: any, hasNext = false): Promise<any[]> {
    const cmdId = hasNext ? (this.commandId) : this.nextCommandId();
    const data = encodeRequest(cmdId, requestType, args, hasNext);

    if (!hasNext) {
      const promise = new Promise<any[]>((resolve, reject) => {
        this.pendingResolve = resolve;
        this.pendingReject = reject;

        // Timeout after 30 seconds
        setTimeout(() => {
          if (this.pendingReject === reject) {
            this.pendingResolve = null;
            this.pendingReject = null;
            this.pendingChunks = [];
            reject(new Error(`RPC command timed out: ${requestType}`));
          }
        }, 30000);
      });

      await this.serial.write(data);
      return promise;
    } else {
      await this.serial.write(data);
      return [];
    }
  }

  async ping(): Promise<boolean> {
    try {
      // Send an empty ping request — simpler and more reliable than sending bytes
      await this.sendCommand("systemPingRequest", {});
      return true;
    } catch {
      return false;
    }
  }

  async mkdir(path: string): Promise<void> {
    try {
      await this.sendCommand("storageMkdirRequest", { path });
    } catch (err: any) {
      // Ignore "already exists" errors
      if (!err?.message?.includes("EXIST")) {
        throw err;
      }
    }
  }

  async deleteFile(path: string, recursive = true): Promise<void> {
    try {
      await this.sendCommand("storageDeleteRequest", { path, recursive });
    } catch {
      // File might not exist, ignore
    }
  }

  async writeFile(path: string, fileData: Uint8Array, onProgress?: ProgressFn): Promise<void> {
    const CHUNK_SIZE = 512;
    const cmdId = this.nextCommandId();

    for (let i = 0; i < fileData.length; i += CHUNK_SIZE) {
      const chunk = fileData.slice(i, i + CHUNK_SIZE);
      const isLast = (i + CHUNK_SIZE) >= fileData.length;

      const args = {
        path,
        file: { data: chunk },
      };

      if (!isLast) {
        // hasNext = true, don't wait for response
        const data = encodeRequest(cmdId, "storageWriteRequest", args, true);
        await this.serial.write(data);
        // Small delay to avoid overwhelming the serial buffer
        if (i % (CHUNK_SIZE * 8) === 0) {
          await this.sleep(10);
        }
      } else {
        // Last chunk, wait for response
        const data = encodeRequest(cmdId, "storageWriteRequest", args, false);
        const promise = new Promise<any[]>((resolve, reject) => {
          this.pendingResolve = resolve;
          this.pendingReject = reject;
          setTimeout(() => {
            if (this.pendingReject === reject) {
              this.pendingResolve = null;
              this.pendingReject = null;
              this.pendingChunks = [];
              reject(new Error("Write timed out"));
            }
          }, 60000);
        });
        await this.serial.write(data);
        const responses = await promise;

        // Check for errors
        for (const res of responses) {
          if (res.commandStatus && res.commandStatus !== 0) {
            throw new Error(`Storage write error: status ${res.commandStatus}`);
          }
        }
      }

      if (onProgress) {
        onProgress(Math.min(i + CHUNK_SIZE, fileData.length), fileData.length);
      }
    }
  }

  async systemUpdate(manifestPath: string): Promise<void> {
    const responses = await this.sendCommand("systemUpdateRequest", {
      updateManifest: manifestPath,
    });

    for (const res of responses) {
      if (res.content?.code !== undefined && res.content.code !== 0) {
        const codeNames = PB_System.UpdateResultCode;
        const codeName = Object.keys(codeNames.values).find(
          (k) => codeNames.values[k] === res.content.code
        ) || `Unknown(${res.content.code})`;
        throw new Error(`Update failed: ${codeName}`);
      }
    }
  }

  async reboot(mode: "OS" | "UPDATE" = "UPDATE"): Promise<void> {
    const modeValue = mode === "UPDATE" ? 2 : 0;
    try {
      // Reboot doesn't send a response, so we just fire and forget
      const data = encodeRequest(this.nextCommandId(), "systemRebootRequest", { mode: modeValue });
      await this.serial.write(data);
    } catch {
      // Expected - device disconnects
    }
  }

  async disconnect(): Promise<void> {
    if (this.sessionStarted) {
      try {
        const data = encodeRequest(this.nextCommandId(), "stopSession", {});
        await this.serial.write(data);
      } catch { /* ignore */ }
    }
    this.sessionStarted = false;
    await this.serial.disconnect();
  }
}
