import { u128 } from "as-bignum/assembly";

import { ethToWei } from "./eth-to-wei";

export function tokenNumberToHex<T>(value: T): string {
  const weiStr = ethToWei(value);
  return weiToTxSlot(weiStr);
}

export function weiToTxSlot(value: string): string {
  const hexStr = u128.from(value.toString()).toString(16);
  return composeAmountStr(hexStr);
}

export function composeAmountStr(amountHexStr: string): string {
  return "0".repeat(64 - amountHexStr.length) + amountHexStr;
}

export function intToHexStr(value: u64): string {
  return value.toString(16);
}
