import { ch, em, zcolor, SimpleTreeOptions, OptionRules, zspace } from "zaffre";

const commonTreeOptions = {
  height: em(15),
  width: ch(30),
  alignItems: "stretch",
  justifyContent: "start",
} satisfies SimpleTreeOptions;

export const treeRules1: OptionRules = {
  "SimpleTree": {
    ...commonTreeOptions,
    showRoot: true,
    initialExpansionLevel: 1,
  } satisfies SimpleTreeOptions,
  "expansionLabelLabel": {
    color: zcolor.red,
  },
};
export const treeRules2: OptionRules = {
  "SimpleTree": {
    ...commonTreeOptions,
    iconSide: "right",
    paddingLeft: ch(1),
    showRoot: false,
  } satisfies SimpleTreeOptions,
  "SimpleTree>TextLabel": {
    color: zcolor.blue,
  },
};

export const basicTreeExampleRules: OptionRules = {
  "SoftGrid": {
    justifyItems: "center",
    minColumnWidth: "40ch",
    rowGap: zspace.s5,
  },

  "tree1": {
    ...commonTreeOptions,
    showRoot: true,
    initialExpansionLevel: 1,
  } satisfies SimpleTreeOptions,
  "SimpleTree>TextLabel": {
    color: zcolor.red,
  },
  
};
