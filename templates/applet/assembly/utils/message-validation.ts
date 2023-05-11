import { JSON } from "@w3bstream/wasm-sdk";

import { getField } from "./payload-parser";

class MessageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MessageValidationError";
  }
}

export function validateField<T extends JSON.Value>(
  data: JSON.Obj,
  field: string
): void {
  const value = getField<T>(data, field);

  if (value instanceof JSON.Str) {
    if (value.valueOf() === "") {
      throw new MessageValidationError(`Missing field ${field}`);
    }
  }

  if (value instanceof JSON.Float || value instanceof JSON.Integer) {
    if (value.valueOf() === 0) {
      throw new MessageValidationError(`Missing field ${field}`);
    }
  }
}
