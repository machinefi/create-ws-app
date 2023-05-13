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

  validateField<JSON.Str>(payload, "public_key");
  const pubKey = getField<JSON.Str>(payload, "public_key");
  verifyPubKeyRegistered(pubKey!.valueOf());

  const ownerAddress = findOwnerAddress(pubKey!.valueOf());

  Log("Owner address: " + ownerAddress);
  Log("Sending tokens to owner address...");

  mintRewards(ownerAddress);

  return 0;
}

function verifyPubKeyRegistered(pk: string): void {
  const pkQuery = `SELECT is_active FROM "devices_registry" WHERE public_key = ?;`;
  const res = QuerySQL(pkQuery, [new String(pk)]);

  if (res == "") {
    assert(false, "Public key not found in DB");
  }
}

function findOwnerAddress(pk: string): string {
  const ownerAddrQuery = `SELECT owner_address FROM "device_binding" WHERE public_key = ?;`;
  const res = QuerySQL(ownerAddrQuery, [new String(pk)]);

  if (res == "") {
    assert(false, "Owner address not found in DB");
  }

  const ownerAddrObj = getPayloadValue(res);
  validateField<JSON.Str>(ownerAddrObj, "owner_address");

  const ownerAddr = getField<JSON.Str>(ownerAddrObj, "owner_address");
  return ownerAddr!.valueOf();
}

function mintRewards(ownerAddress: string): void {
  Log(`Minting ${TOKEN_AMOUNT} token to ${ownerAddress}`);
  const txData = buildTxData(MINT_FUNCTION_ADDR, ownerAddress, TOKEN_AMOUNT);
  const res = SendTx(CHAIN_ID, TOKEN_CONTRACT_ADDRESS, "0", txData);
  Log("Send tx result:" + res);
}
