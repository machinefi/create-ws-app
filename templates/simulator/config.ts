import dotenv from "dotenv";
dotenv.config();

export default {
  PUB_TOKEN: process.env.PUB_TOKEN || "",
  W3BSTREAM_ENDPOINT: `https://devnet-prod.w3bstream.com/api/w3bapp/event/${
    process.env.PROJECT_NAME
  }?eventType=${process.env.EVENT_TYPE || "DEFAULT"}`,
};
