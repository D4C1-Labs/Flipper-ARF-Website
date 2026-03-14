/**
 * Flipper Zero Protobuf RPC - Minimal implementation for firmware update
 * Based on https://github.com/flipperdevices/flipperzero-protobuf
 * 
 * Uses protobufjs reflection API to define only the messages needed
 * for firmware upload and update.
 */
import * as protobuf from "protobufjs";

// Build the protobuf schema programmatically
const root = new protobuf.Root();

// PB_Storage namespace
const pbStorage = new protobuf.Namespace("PB_Storage");

const FileType = new protobuf.Enum("FileType", { FILE: 0, DIR: 1 });
const File = new protobuf.Type("File")
  .add(new protobuf.Field("type", 1, "FileType"))
  .add(new protobuf.Field("name", 2, "string"))
  .add(new protobuf.Field("size", 3, "uint32"))
  .add(new protobuf.Field("data", 4, "bytes"))
  .add(new protobuf.Field("md5sum", 5, "string"));
File.add(FileType);

const StorageWriteRequest = new protobuf.Type("WriteRequest")
  .add(new protobuf.Field("path", 1, "string"))
  .add(new protobuf.Field("file", 2, "PB_Storage.File"));

const StorageMkdirRequest = new protobuf.Type("MkdirRequest")
  .add(new protobuf.Field("path", 1, "string"));

const StorageDeleteRequest = new protobuf.Type("DeleteRequest")
  .add(new protobuf.Field("path", 1, "string"))
  .add(new protobuf.Field("recursive", 2, "bool"));

const StorageListRequest = new protobuf.Type("ListRequest")
  .add(new protobuf.Field("path", 1, "string"));

const StorageListResponse = new protobuf.Type("ListResponse")
  .add(new protobuf.Field("file", 1, "PB_Storage.File", "repeated"));

pbStorage.add(File).add(FileType)
  .add(StorageWriteRequest)
  .add(StorageMkdirRequest)
  .add(StorageDeleteRequest)
  .add(StorageListRequest)
  .add(StorageListResponse);

// PB_System namespace
const pbSystem = new protobuf.Namespace("PB_System");

const PingRequest = new protobuf.Type("PingRequest")
  .add(new protobuf.Field("data", 1, "bytes"));

const PingResponse = new protobuf.Type("PingResponse")
  .add(new protobuf.Field("data", 1, "bytes"));

const RebootMode = new protobuf.Enum("RebootMode", { OS: 0, DFU: 1, UPDATE: 2 });
const RebootRequest = new protobuf.Type("RebootRequest")
  .add(RebootMode)
  .add(new protobuf.Field("mode", 1, "RebootMode"));

const DeviceInfoRequest = new protobuf.Type("DeviceInfoRequest");
const DeviceInfoResponse = new protobuf.Type("DeviceInfoResponse")
  .add(new protobuf.Field("key", 1, "string"))
  .add(new protobuf.Field("value", 2, "string"));

const UpdateRequest = new protobuf.Type("UpdateRequest")
  .add(new protobuf.Field("updateManifest", 1, "string"));

const UpdateResultCode = new protobuf.Enum("UpdateResultCode", {
  OK: 0, ManifestPathInvalid: 1, ManifestFolderNotFound: 2,
  ManifestInvalid: 3, StageMissing: 4, StageIntegrityError: 5,
  ManifestPointerError: 6, TargetMismatch: 7, OutdatedManifestVersion: 8,
  IntFull: 9, UnspecifiedError: 10,
});
const UpdateResponse = new protobuf.Type("UpdateResponse")
  .add(UpdateResultCode)
  .add(new protobuf.Field("code", 1, "PB_System.UpdateResultCode"));

pbSystem.add(PingRequest).add(PingResponse)
  .add(RebootRequest).add(RebootMode)
  .add(DeviceInfoRequest).add(DeviceInfoResponse)
  .add(UpdateRequest).add(UpdateResponse).add(UpdateResultCode);

// PB namespace (Main message)
const pb = new protobuf.Namespace("PB");

const CommandStatus = new protobuf.Enum("CommandStatus", {
  OK: 0, ERROR: 1, ERROR_DECODE: 2, ERROR_NOT_IMPLEMENTED: 3,
  ERROR_BUSY: 4, ERROR_STORAGE_NOT_READY: 5, ERROR_STORAGE_EXIST: 6,
  ERROR_STORAGE_NOT_EXIST: 7, ERROR_STORAGE_INVALID_PARAMETER: 8,
  ERROR_STORAGE_DENIED: 9, ERROR_STORAGE_INVALID_NAME: 10,
  ERROR_STORAGE_INTERNAL: 11, ERROR_STORAGE_NOT_IMPLEMENTED: 12,
  ERROR_STORAGE_ALREADY_OPEN: 13, ERROR_CONTINUOUS_COMMAND_INTERRUPTED: 14,
  ERROR_INVALID_PARAMETERS: 15,
});

const Empty = new protobuf.Type("Empty");
const StopSession = new protobuf.Type("StopSession");

const Main = new protobuf.Type("Main")
  .add(new protobuf.Field("commandId", 1, "uint32"))
  .add(new protobuf.Field("commandStatus", 2, "PB.CommandStatus"))
  .add(new protobuf.Field("hasNext", 3, "bool"))
  .add(new protobuf.Field("empty", 4, "PB.Empty"))
  .add(new protobuf.Field("stopSession", 19, "PB.StopSession"))
  .add(new protobuf.Field("systemPingRequest", 5, "PB_System.PingRequest"))
  .add(new protobuf.Field("systemPingResponse", 6, "PB_System.PingResponse"))
  .add(new protobuf.Field("systemRebootRequest", 31, "PB_System.RebootRequest"))
  .add(new protobuf.Field("systemDeviceInfoRequest", 32, "PB_System.DeviceInfoRequest"))
  .add(new protobuf.Field("systemDeviceInfoResponse", 33, "PB_System.DeviceInfoResponse"))
  .add(new protobuf.Field("systemUpdateRequest", 41, "PB_System.UpdateRequest"))
  .add(new protobuf.Field("systemUpdateResponse", 46, "PB_System.UpdateResponse"))
  .add(new protobuf.Field("storageWriteRequest", 11, "PB_Storage.WriteRequest"))
  .add(new protobuf.Field("storageMkdirRequest", 13, "PB_Storage.MkdirRequest"))
  .add(new protobuf.Field("storageDeleteRequest", 12, "PB_Storage.DeleteRequest"))
  .add(new protobuf.Field("storageListRequest", 7, "PB_Storage.ListRequest"))
  .add(new protobuf.Field("storageListResponse", 8, "PB_Storage.ListResponse"));

pb.add(CommandStatus).add(Empty).add(StopSession).add(Main);

root.add(pb).add(pbStorage).add(pbSystem);

// Resolve all types
root.resolveAll();

export const PB = {
  Main: root.lookupType("PB.Main"),
  CommandStatus: root.lookupEnum("PB.CommandStatus"),
};

export const PB_System = {
  UpdateResultCode: root.lookupEnum("PB_System.UpdateResultCode"),
};

export function encodeRequest(commandId: number, requestType: string, args: any, hasNext = false): Uint8Array {
  const payload: any = { commandId };
  payload[requestType] = args;
  if (hasNext) payload.hasNext = true;
  const message = PB.Main.create(payload);
  const writer = PB.Main.encodeDelimited(message);
  return new Uint8Array(writer.finish());
}

export interface RpcResponse {
  commandId: number;
  commandStatus: number;
  hasNext: boolean;
  content: any;
  contentType: string;
}

export function decodeResponse(data: Uint8Array): { response: RpcResponse; bytesRead: number } | null {
  try {
    const reader = protobuf.Reader.create(data);
    const res = PB.Main.decodeDelimited(reader) as any;
    
    // Find the content field
    let contentType = "";
    let content: any = null;
    const contentFields = [
      "empty", "stopSession",
      "systemPingResponse", "systemDeviceInfoResponse",
      "systemUpdateResponse",
      "storageListResponse",
    ];
    for (const field of contentFields) {
      if (res[field] != null) {
        contentType = field;
        content = res[field];
        break;
      }
    }

    return {
      response: {
        commandId: res.commandId || 0,
        commandStatus: res.commandStatus || 0,
        hasNext: res.hasNext || false,
        content,
        contentType,
      },
      bytesRead: reader.pos,
    };
  } catch {
    return null;
  }
}
