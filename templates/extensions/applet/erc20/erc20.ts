import { GetDataByRID, JSON, QuerySQL, Log, SendTx } from "@w3bstream/wasm-sdk";
import { String } from "@w3bstream/wasm-sdk/assembly/sql";

import { buildTxData } from "../utils/build-tx";
import { getField, getPayloadValue } from "../utils/payload-parser";
import { validateField } from "../utils/message-validation";

const MINT_FUNCTION_ADDR = "40c10f19";
const CHAIN_ID = 4690;
const TOKEN_CONTRACT_ADDRESS = "<YOUR_CONTRACT_ADDRESS>";
const TOKEN_AMOUNT = "1";

export function handle_data(rid: i32): i32 {
  Log("Hello W3bstream!");
  const deviceMessage = GetDataByRID(rid);
  Log("Device message: " + deviceMessage);

  const payload = getPayloadValue(deviceMessage);

  validateField<JSON.Str>(payload, "deviceId");
  const deviceId = getField<JSON.Str>(payload, "deviceId");
  verifyDeviceRegistered(deviceId!.valueOf());

  const ownerAddress = findOwnerAddress(deviceId!.valueOf());

  Log("Owner address: " + ownerAddress);
  Log("Sending tokens to owner address...");

  mintRewards(ownerAddress, TOKEN_AMOUNT);

  return 0;
}

function verifyDeviceRegistered(id: string): void {
  const deviceQuery = `SELECT is_active FROM "devices_registry" WHERE device_id = ?;`;
  const res = QuerySQL(deviceQuery, [new String(id)]);

  if (res == "") {
    assert(false, "Device id not found in DB");
  }
}

function findOwnerAddress(id: string): string {
  const ownerAddrQuery = `SELECT owner_address FROM "device_binding" WHERE device_id = ?;`;
  const res = QuerySQL(ownerAddrQuery, [new String(id)]);

  if (res == "") {
    assert(false, "Owner address not found in DB");
  }

  const ownerAddrObj = getPayloadValue(res);
  validateField<JSON.Str>(ownerAddrObj, "owner_address");

  const ownerAddr = getField<JSON.Str>(ownerAddrObj, "owner_address");
  return ownerAddr!.valueOf();
}

function mintRewards<T>(ownerAddress: string, amount: T): void {
  const txData = buildTxData(MINT_FUNCTION_ADDR, ownerAddress, amount);
  const res = SendTx(CHAIN_ID, TOKEN_CONTRACT_ADDRESS, "0", txData);
  Log("Send tx result:" + res);
}
