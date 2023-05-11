import { Log, GetDataByRID } from "@w3bstream/wasm-sdk";

export { alloc } from "@w3bstream/wasm-sdk";

// W3bstream handler
export function start(rid: i32): i32 {
  Log("Hello World!");

  const deviceMessage = GetDataByRID(rid);
  Log("device message: " + deviceMessage);

  return 0;
}
