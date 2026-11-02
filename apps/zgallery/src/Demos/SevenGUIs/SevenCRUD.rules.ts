import { ch, em, pct, zborder, zcolor, zspace } from "zaffre";

export const sevenCrudRules = {
  "TextInput": {
    border: zborder.thin,
    width: ch(15),
    textAlign: "start",
  },
  "Button": {
    width: ch(10),
    background: zcolor.primaryContainer,
  },
  "topStack": {
    border: zborder.thin,
    justifyContent: "center",
    padding: zspace.s6,
    gap: zspace.s8,
  },
  "ListBox": {
  width: pct(100),
    height: em(10),
    padding: zspace.s1,
  }
};