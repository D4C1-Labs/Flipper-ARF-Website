/**
 * Flipper Zero Web Serial connection handler
 * Manages serial port communication with the Flipper device
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
const nav = navigator as any;

const FLIPPER_USB_FILTER = { usbVendorId: 0x0483, usbProductId: 0x5740 };

export type SerialEventHandler = (data: Uint8Array) => void;

export class FlipperSerial {
  private port: any = null;
  private reader: any = null;
  private readLoop: Promise<void> | null = null;
  private onData: SerialEventHandler | null = null;
  private _connected = false;

  get connected() {
    return this._connected;
  }

  static isSupported(): boolean {
    return "serial" in navigator;
  }

  async requestPort(): Promise<void> {
    this.port = await nav.serial.requestPort({
      filters: [FLIPPER_USB_FILTER],
    });
  }

  async connect(onData: SerialEventHandler): Promise<string> {
    if (!this.port) {
      const ports = await nav.serial.getPorts();
      const flipperPort = ports.find((p: any) => {
        const info = p.getInfo();
        return info.usbVendorId === FLIPPER_USB_FILTER.usbVendorId &&
               info.usbProductId === FLIPPER_USB_FILTER.usbProductId;
      });
      if (flipperPort) {
        this.port = flipperPort;
      } else {
        throw new Error("No Flipper Zero found. Click Connect to select your device.");
      }
    }

    this.onData = onData;

    try {
      await this.port.open({ baudRate: 1 });
    } catch (err: any) {
      if (err.message?.includes("already open")) {
        await this.port.close();
        await this.port.open({ baudRate: 1 });
      } else {
        throw err;
      }
    }

    this._connected = true;
    this.startReading();

    const info = this.port.getInfo();
    return `Flipper Zero (VID:${info.usbVendorId?.toString(16)} PID:${info.usbProductId?.toString(16)})`;
  }

  private startReading() {
    if (!this.port?.readable) return;
    
    this.readLoop = (async () => {
      while (this.port?.readable && this._connected) {
        try {
          this.reader = this.port.readable.getReader();
          while (true) {
            const { value, done } = await this.reader.read();
            if (done) break;
            if (value && this.onData) {
              this.onData(value);
            }
          }
        } catch {
          // Reader was cancelled or port disconnected
        } finally {
          this.reader?.releaseLock();
          this.reader = null;
        }
      }
    })();
  }

  async write(data: Uint8Array): Promise<void> {
    if (!this.port?.writable) {
      throw new Error("Serial port not writable");
    }
    const writer = this.port.writable.getWriter();
    try {
      await writer.write(data);
    } finally {
      writer.releaseLock();
    }
  }

  async writeString(str: string): Promise<void> {
    const encoder = new TextEncoder();
    await this.write(encoder.encode(str));
  }

  async disconnect(): Promise<void> {
    this._connected = false;
    try {
      await this.reader?.cancel();
    } catch { /* ignore */ }
    try {
      await this.port?.close();
    } catch { /* ignore */ }
    this.port = null;
    this.reader = null;
  }
}
