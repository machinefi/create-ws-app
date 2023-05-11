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
};

export type Args = {
  directory: string;
  binding: boolean | undefined;
  erc20: boolean | undefined;
  erc721: boolean | undefined;
  simulator: boolean | undefined;
  minimal: boolean | undefined;
};
