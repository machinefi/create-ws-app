import { GetDataByRID, JSON, ExecSQL, Log } from "@w3bstream/wasm-sdk";
import { String, Bool } from "@w3bstream/wasm-sdk/assembly/sql";

export { alloc } from "@w3bstream/wasm-sdk";

import { validateMsg } from "./helpers";

export function start(rid: i32): i32 {
  Log("Hello World!");

  const deviceMessage = GetDataByRID(rid);
  Log("device message: " + deviceMessage);

  validateMsg(deviceMessage);

  return 0;
}

export function handle_device_registered(rid: i32): i32 {
  Log("New Device Registered Detected: ");
  let message_string = GetDataByRID(rid);
  let message_json = JSON.parse(message_string) as JSON.Obj;
  let topics = message_json.get("topics") as JSON.Arr;
  let device_id = topics._arr[1].toString();
  Log("Device ID: " + device_id);

  // Store the device id in the DB
  Log("Storing device id in DB...");
  let sql = `INSERT INTO "DevicesRegistry" (device_id, is_registered, is_active) VALUES (?,?,?);`;
  ExecSQL(sql, [new String(device_id), new Bool(true), new Bool(true)]);
  return 0;
}

export function handle_device_binding(rid: i32): i32 {
  Log("New Device Binding Detected: ");
  let message_string = GetDataByRID(rid);
  let message_json = JSON.parse(message_string) as JSON.Obj;
  let topics = message_json.get("topics") as JSON.Arr;
  let device_id = topics._arr[1].toString();
  let owner_address_padded = topics._arr[2] as JSON.Str;

  let owner_address = owner_address_padded.valueOf().slice(26);
  Log("Device ID: " + device_id);
  Log("Owner Address: " + owner_address);

  // Store the device binding in the DB
  Log("Storing device binding in DB...");
  let sql = `INSERT INTO "DeviceBinding" (device_id, owner_address) VALUES (?,?);`;
  ExecSQL(sql, [new String(device_id), new String(owner_address)]);
  return 0;
}