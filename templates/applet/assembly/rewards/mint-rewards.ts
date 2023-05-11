import { Log, SendTx } from "@w3bstream/wasm-sdk";

import { buildTxData } from "../utils/build-tx";

const MINT_FUNCTION_ADDR = "40c10f19";
const CHAIN_ID = 4690;
// const TRANSFER_FUNCTION_ADDR = "a9059cbb";

export function mintRewards(
  tokenContract: string,
  recipient: string,
  tokenAmount: string
): void {
  const data = buildTxData(MINT_FUNCTION_ADDR, recipient, tokenAmount);

  Log(`Minting ${tokenAmount} token to ${recipient}`);
  const res = SendTx(CHAIN_ID, tokenContract, "0", data);
  Log("Send tx result:" + res);
}
