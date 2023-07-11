import Big from "as-big";

export function ethToWei(eth: string): string {
  if (eth === "") {
    throw new Error("Value is not a number");
  }
  const v = Big.of(eth).times(Big.of(10).pow(18));
  return v.__stringify(false, true);
}
