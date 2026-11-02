import { zspace, zborder, ch, zfont } from "zaffre";
import { TransitionModel2 } from "./TransitionModel2";

export const transitionExample2Rules = (model: TransitionModel2) => ({
  "HStack": {
    alignItems: "center",
  },
  "VStack": {
    padding: zspace.s4,
    alignItems: "center",
    width: "fit-content",
  },
  "Button": {
    marginInlineStart: zspace.s7,
    label: "Toggle",
    action: () => model.toggleText(),
  },
  "CenterBox": {
    overflow: "hidden",
    border: zborder.thin,
    width: ch(11),
    height: ch(11),
  },
  "effect-label": {
    font: zfont.title_medium.bold(),
    width: "fit-content",
  },
  "effect-name": {
    font: zfont.body_medium,
  },
});
