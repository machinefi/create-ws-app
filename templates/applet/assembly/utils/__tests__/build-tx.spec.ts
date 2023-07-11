import { buildTxData } from "../build-tx";

const TX_DATA =
  "0x40c10f1900000000000000000000000036f075ef0437b5fe95a7d0293823f1e085416ddf0000000000000000000000000000000000000000000000003782dace9d900000";
const TX_DATA_2 =
  "0x40c10f1900000000000000000000000036f075ef0437b5fe95a7d0293823f1e085416ddf000000000000000000000000000000000000000000000001dd6559bdb1700000"
const TX_DATA_3 =
  "0x40c10f1900000000000000000000000036f075ef0437b5fe95a7d0293823f1e085416ddf0000000000000000000000000000000000000000000422e5a5eed78714500000"

const RECIPIENT_ADDR = "0x36f075ef0437b5fe95a7d0293823f1e085416ddf";
const FUNCTION_ADDR = "40c10f19";

test("tx data builder", () => {
  it("should build a tx data string with amount as a string", () => {
    expect<string>(buildTxData(FUNCTION_ADDR, RECIPIENT_ADDR, "4")).toBe(
      TX_DATA
    );
    expect<string>(buildTxData(FUNCTION_ADDR, RECIPIENT_ADDR, "34.4")).toBe(
      TX_DATA_2
    );
    expect<string>(buildTxData(FUNCTION_ADDR, RECIPIENT_ADDR, "5000500")).toBe(
      TX_DATA_3
    )
  });
  it("should build a tx data string with amount as a number", () => {
    expect<string>(buildTxData(FUNCTION_ADDR, RECIPIENT_ADDR, 4)).toBe(
      TX_DATA
    );
    expect<string>(buildTxData(FUNCTION_ADDR, RECIPIENT_ADDR, 34.4)).toBe(
      TX_DATA_2
    );
    expect<string>(buildTxData(FUNCTION_ADDR, RECIPIENT_ADDR, 5000500)).toBe(
      TX_DATA_3
    )
  });
  itThrows("should throw an error if amount is not a number", () => {
    buildTxData(FUNCTION_ADDR, RECIPIENT_ADDR, "a");
  });
  itThrows("should throw an error if amount is empty", () => {
    buildTxData(FUNCTION_ADDR, RECIPIENT_ADDR, "");
  });
});
