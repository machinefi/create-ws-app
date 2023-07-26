import { Simulator } from "@w3bstream/w3bstream-http-client-simulator";
import 'dotenv/config'

import dataGenerator from "./generator";

const API_TOKEN = process.env.API_TOKEN || "";
const W3BSTREAM_ENDPOINT = process.env.HTTP_ROUTE || "";
const EVENT_TYPE = process.env.EVENT_TYPE || "";
const MSG_INTERVAL_SEC = 10;

const simulator = new Simulator(API_TOKEN, W3BSTREAM_ENDPOINT);

simulator.init();

simulator.dataPointGenerator = dataGenerator;

async function start() {
  try {
    console.log("Starting simulator");
    simulator.powerOn(MSG_INTERVAL_SEC, EVENT_TYPE)
  } catch (error) {
    console.log(error);
  }
}
start();
