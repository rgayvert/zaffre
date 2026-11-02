import { MenuItemList, zfont, zspace } from "zaffre";

export const searchBoxExampleRules = (contextList: MenuItemList<string>) => {
  return {
    "search-example-top": {
      templateColumns: "1fr 1fr",
      gap: zspace.s7,
    },
    "SearchBox": {
      font: zfont.body_medium,
    },
    "SearchBox>TextInput": {
      placeholder: () => `Search ${contextList.get()}`
    },
  };
};
