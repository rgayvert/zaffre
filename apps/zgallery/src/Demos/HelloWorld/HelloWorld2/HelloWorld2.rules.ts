import { ch, space, zfont, zspace } from "zaffre";
import { HelloModel2 } from "./HelloModel2";

export const helloWorld2Rules = (model: HelloModel2) => ({
  "container": {
    maxWidth: ch(120),
    gap: space.s4,
  },
  "TextInput": {
    disabled: model.disabled,
    setOnInput: model.setOnInput,
  },
  "controls": {
    gap: zspace.s7,
  },
  "Button": {
    label: "Reset",
    font: zfont.label_large.bold(),
    action: () => model.reset(),
  },
});
