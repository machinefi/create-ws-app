import { GetDataByRID, JSON, ExecSQL, Log } from "@w3bstream/wasm-sdk";
import { String, Bool } from "@w3bstream/wasm-sdk/assembly/sql";

import { getField, getPayloadValue } from "../utils/payload-parser";

const DEVICE_BINDING_TABLE = "device_binding";
const DEVICE_REGISTRY_TABLE = "devices_registry";

export function handle_device_binding(rid: i32): i32 {
  Log("New Device Binding Detected: ");
  const topics = getTopics(rid);

  const deviceId = getDeviceId(topics);
  Log("Device ID: " + deviceId);

  const ownerAddr = getOwnerAddr(topics);
  Log("Owner Address: " + ownerAddr);

  storeDeviceBinding(deviceId, ownerAddr);
  return 0;
}

export function handle_device_registered(rid: i32): i32 {
  Log("New Device Registered Detected: ");
  const topics = getTopics(rid);

  const deviceId = getDeviceId(topics);
  Log("Device ID: " + deviceId);

  storeDeviceId(deviceId);
  return 0;
}

function getTopics(rid: i32): JSON.Arr {
  const deviceMessage = GetDataByRID(rid);
  const payload = getPayloadValue(deviceMessage);
  const topics = getField<JSON.Arr>(payload, "topics");

  if (topics == null) {
    assert(false, "Topics not found in payload");
  }

  return topics!;
}

function getDeviceId(topics: JSON.Arr): string {
  return topics._arr[1].toString();
}

function getOwnerAddr(topics: JSON.Arr): string {
  const ownerAddrPadded = topics._arr[2].toString();
  return ownerAddrPadded.slice(26);
}

function storeDeviceBinding(deviceId: string, ownerAddr: string): void {
  Log("Storing device binding in DB...");
  const sql = `INSERT INTO "${DEVICE_BINDING_TABLE}" (device_id, owner_address) VALUES (?,?);`;
  ExecSQL(sql, [new String(deviceId), new String(ownerAddr)]);
}

function storeDeviceId(deviceId: string): void {
  Log("Storing device id in DB...");
  const sql = `INSERT INTO "${DEVICE_REGISTRY_TABLE}" (device_id, is_registered, is_active) VALUES (?,?,?);`;
  ExecSQL(sql, [new String(deviceId), new Bool(true), new Bool(true)]);
}
