import { getWSProjectConfig, writeToConfig } from "./read-write";

interface EnvVar {
  envName: string;
  envValue: string | number;
}

export const addEnvVarToWSProjectConfig = (env: EnvVar) => {
  const projectConfig = getWSProjectConfig();
  addEnvVarToConfig(projectConfig, env);
  writeToConfig(projectConfig);
};

const addEnvVarToConfig = (config: any, env: EnvVar) => {
  if (isEnvExistsInConfig(config, env)) {
    replaceEnvInConfig(config, env);
  } else {
    appendEnvToConfig(config, env);
  }
};

const isEnvExistsInConfig = (config: any, env: EnvVar): boolean => {
  const { envs } = config;
  const { envName } = env;
  const res = envs.env.find(([name]: [string, string]) => name === envName);
  return !!res;
};

const replaceEnvInConfig = (config: any, env: EnvVar) => {
  config.envs.env = config.envs.env.map(([name, value]: [string, string]) => {
    if (name === env.envName) {
      return [name, env.envValue];
    }
    return [name, value];
  });
};

const appendEnvToConfig = (config: any, env: EnvVar) => {
  config.envs.env.push([env.envName, env.envValue]);
};
