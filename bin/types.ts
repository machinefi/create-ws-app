export type Flags = {
  blockchain: {
    type: "boolean";
    shortFlag: "b";
  };
  simulator: {
    type: "boolean";
    shortFlag: "s";
  };
  applet: {
    type: "boolean";
    shortFlag: "a";
  };
  erc20: {
    type: "boolean";
    shortFlag: "e";
  };
  erc721: {
    type: "boolean";
    shortFlag: "n";
  };
};

export type Args = {
  directory: string;
  blockchain: boolean | undefined;
  erc20: boolean | undefined;
  erc721: boolean | undefined;
  simulator: boolean | undefined;
};
