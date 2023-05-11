import dotenv from "dotenv";
dotenv.config();

export default {
  PUB_TOKEN: process.env.PUB_TOKEN || "",
  W3BSTREAM_ENDPOINT: `http://dev.w3bstream.com:8889/srv-applet-mgr/v0/event/${
    process.env.PROJECT_NAME
  }?eventType=${process.env.EVENT_TYPE || "DEFAULT"}`,
};
