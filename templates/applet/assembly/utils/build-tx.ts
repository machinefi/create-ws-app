import { buildTxSlot, buildTxString, ethToHex } from "@w3bstream/wasm-sdk/assembly/utility"

export function buildTxData<T>(
  functionAddr: string,
  recipient: string,
  tokenAmount: T
): string {
  const slotForRecipient = buildTxSlot(recipient.replace("0x", ""));
  const slotForAmount = tokenNumberToTxSlot(tokenAmount);

  return buildTxString([functionAddr, slotForRecipient, slotForAmount]);
}

function tokenNumberToTxSlot<T>(value: T): string {
  const ethHex = ethToHex(value);
  return buildTxSlot(ethHex);
}