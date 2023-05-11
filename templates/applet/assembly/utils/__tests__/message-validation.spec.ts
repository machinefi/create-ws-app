import { JSON } from "@w3bstream/wasm-sdk";

import { validateField } from "../message-validation";
import { getPayloadValue, getField } from "../payload-parser";
import { DEVICE_MESSAGE } from "./fixtures/msg";

function getData(message: string): JSON.Obj | null {
  const payload = getPayloadValue(message);
  return getField<JSON.Obj>(payload, "data");
}

test("Message validation", () => {
  describe("Should validate message", () => {
    it("should validate message", () => {
      const payload = getPayloadValue(DEVICE_MESSAGE);
      validateField<JSON.Str>(payload, "public_key");
      validateField<JSON.Str>(payload, "signature");
    });
    itThrows("should throw error if message is not a valid JSON", () => {
      const invalidMessage = "invalid message";
      const payload = getPayloadValue(invalidMessage);
      validateField<JSON.Str>(payload, "public_key");
      validateField<JSON.Str>(payload, "signature");
    });
  });
  describe("Data validation", () => {
    it("should validate data", () => {
      getData(DEVICE_MESSAGE);
    });
    itThrows("should throw error if there is no data", () => {
      const invalidMessage =
        '{"public_key":"public_key","signature":"signature"}';
      getData(invalidMessage);
    });
    itThrows("should throw if data is null", () => {
      const invalidMessage =
        '{"data":null,"public_key":"public_key","signature":"signature"}';
      getData(invalidMessage);
    });
    itThrows("should throw if data is not an object", () => {
      const invalidMessage =
        '{"data":"data","public_key":"public_key","signature":"signature"}';
      getData(invalidMessage);
    });
  });
  describe("Sensor reading validation", () => {
    it("should validate sensor reading", () => {
      const data = getData(DEVICE_MESSAGE);

      validateField<JSON.Float>(data!, "sensor_reading");
    });
    itThrows("should throw if there is no sensor reading", () => {
      const invalidMessage =
        '{"data":{"timestamp":1681943510756},"public_key":"public_key","signature":"signature"}';
      const data = getData(invalidMessage);

      validateField<JSON.Float>(data!, "sensor_reading");
    });
    itThrows("should throw if sensor reading is null", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":null,"timestamp":1681943510756},"public_key":"public_key","signature":"signature"}';
      const data = getData(invalidMessage);

      validateField<JSON.Float>(data!, "sensor_reading");
    });
    itThrows("should throw if sensor reading is not a float", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1,"timestamp":1681943510756},"public_key":"public_key","signature":"signature"}';
      const data = getData(invalidMessage);

      validateField<JSON.Float>(data!, "sensor_reading");
    });
  });
  describe("Timestamp validation", () => {
    it("should validate timestamp", () => {
      const data = getData(DEVICE_MESSAGE);

      validateField<JSON.Integer>(data!, "timestamp");
    });
    itThrows("should throw if there is no timestamp", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0},"public_key":"public_key","signature":"signature"}';
      const data = getData(invalidMessage);

      validateField<JSON.Integer>(data!, "timestamp");
    });
    itThrows("should throw if timestamp is null", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0,"timestamp":null},"public_key":"public_key","signature":"signature"}';
      const data = getData(invalidMessage);

      validateField<JSON.Integer>(data!, "timestamp");
    });
    itThrows("should throw if timestamp is not an integer", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0,"timestamp":1.0},"public_key":"public_key","signature":"signature"}';
      const data = getData(invalidMessage);

      validateField<JSON.Integer>(data!, "timestamp");
    });
  });
  describe("Public key validation", () => {
    itThrows("should throw if there is no public key", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0,"timestamp":1681943510756},"signature":"signature"}';
      const payload = getPayloadValue(invalidMessage);
      validateField<JSON.Str>(payload, "public_key");
    });
    itThrows("should throw if public key is null", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0,"timestamp":1681943510756},"public_key":null,"signature":"signature"}';
      const payload = getPayloadValue(invalidMessage);
      validateField<JSON.Str>(payload, "public_key");
    });
    itThrows("should throw if public key is not a string", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0,"timestamp":1681943510756},"public_key":1,"signature":"signature"}';
      const payload = getPayloadValue(invalidMessage);
      validateField<JSON.Str>(payload, "public_key");
    });
    itThrows("should throw if public key is empty string", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0,"timestamp":1681943510756},"public_key":"","signature":"signature"}';
      const payload = getPayloadValue(invalidMessage);
      validateField<JSON.Str>(payload, "public_key");
    });
  });
  describe("Signature validation", () => {
    itThrows("should throw if there is no signature", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0,"timestamp":1681943510756},"public_key":"public_key"}';
      const payload = getPayloadValue(invalidMessage);
      validateField<JSON.Str>(payload, "signature");
    });
    itThrows("should throw if signature is null", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0,"timestamp":1681943510756},"public_key":"public_key","signature":null}';
      const payload = getPayloadValue(invalidMessage);
      validateField<JSON.Str>(payload, "signature");
    });
    itThrows("should throw if signature is not a string", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0,"timestamp":1681943510756},"public_key":"public_key","signature":1}';
      const payload = getPayloadValue(invalidMessage);
      validateField<JSON.Str>(payload, "signature");
    });
    itThrows("should throw if signature is empty string", () => {
      const invalidMessage =
        '{"data":{"sensor_reading":1.0,"timestamp":1681943510756},"public_key":"public_key","signature":""}';
      const payload = getPayloadValue(invalidMessage);
      validateField<JSON.Str>(payload, "signature");
    });
  });
});
