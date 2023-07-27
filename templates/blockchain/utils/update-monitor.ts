import { getWSProjectConfig, writeToConfig } from "./read-write";

interface ContractMonitor {
  eventType: string;
  chainID: number;
  contractAddress: string;
  blockStart: number;
  blockEnd: number;
  topic0: string;
}

export const updateContractMonitor = (monitor: ContractMonitor) => {
  const projectConfig = getWSProjectConfig();
  addMonitorToConfig(projectConfig, monitor);
  writeToConfig(projectConfig);
};

const addMonitorToConfig = (config: any, monitor: ContractMonitor) => {
  if (isEventExistsInConfig(config, monitor)) {
    replaceEventInConfig(config, monitor);
  } else {
    appendEventToConfig(config, monitor);
  }
};

const isEventExistsInConfig = (
  config: any,
  monitor: ContractMonitor
): boolean => {
  const { contractLog } = config;
  const { eventType } = monitor;
  const res = contractLog.find(
    (event: ContractMonitor) => event.eventType === eventType
  );
  return !!res;
};

const replaceEventInConfig = (config: any, monitor: ContractMonitor) => {
  config.contractLog = config.contractLog.map((event: ContractMonitor) => {
    if (event.eventType === monitor.eventType) {
      return monitor;
    }
    return event;
  });
};

const appendEventToConfig = (config: any, monitor: ContractMonitor) => {
  config.contractLog.push(monitor);
};
