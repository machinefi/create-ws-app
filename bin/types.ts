export type Flags = {
  binding: {
    type: "boolean";
    shortFlag: "b";
  };
  simulator: {
    type: "boolean";
    shortFlag: "s";
  };
  erc20: {
    type: "boolean";
    shortFlag: "e";
  };
  erc721: {
    type: "boolean";
    shortFlag: "n";
  };
  minimal: {
    type: "boolean";
    shortFlag: "m";
  };
  help: {
    type: "boolean";
    shortFlag: "h";
  };
  yes: {
    type: "boolean";
    shortFlag: "y";
  };
};

export type Args = {
  directory: string;
  binding: boolean | undefined;
  erc20: boolean | undefined;
  erc721: boolean | undefined;
  simulator: boolean | undefined;
  minimal: boolean | undefined;
  yes: boolean | undefined;
  help: boolean | undefined;
};
