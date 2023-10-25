import path from "path";
import fs from "fs";

const PATH_TO_CONFIG = "../../applet/wsproject.json";

export const getWSProjectConfig = () => {
  const file = fs.readFileSync(path.resolve(__dirname, PATH_TO_CONFIG));
  return JSON.parse(file.toString());
};

export const writeToConfig = (config: any) => {
  fs.writeFileSync(
    path.resolve(__dirname, PATH_TO_CONFIG),
    JSON.stringify(config, null, 2),
  );
};
