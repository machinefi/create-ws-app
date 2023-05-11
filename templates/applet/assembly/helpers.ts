import { JSON } from "@w3bstream/wasm-sdk";

import { getField, getPayloadValue } from "./utils/payload-parser";
import { validateField } from "./utils/message-validation";

export function validateMsg(message: string): void {
  const payload = getPayloadValue(message);
  validateField<JSON.Str>(payload, "public_key");
  validateField<JSON.Str>(payload, "signature");

  const data = getField<JSON.Obj>(payload, "data");
  validateField<JSON.Integer>(data!, "timestamp");
  validateField<JSON.Float>(data!, "sensor_reading");
}
