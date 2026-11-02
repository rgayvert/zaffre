import { atom, ch, em, pct, simpleInteractionEffects, transitions, zborder, zcolor, zfont, zrounding, zspace } from "zaffre";
import { SimpleButtonExampleModel } from "./SimpleButtonExampleModel";

export const simpleButtonExampleRules = (model: SimpleButtonExampleModel) => ({
  "HStack": {
    gap: zspace.s5,
  },
  "button1": {
    label: "Default",
    action: () => model.result.set("(default)"),
  },
  "button2": {
    label: "Plain",
    action: () => model.result.set("(plain)"),
    effects: simpleInteractionEffects(),
    ripple: false,
    controlSize: "sm",
    rounding: zrounding.pill,
  },
  "button3": {
    label: "Filled",
    background: zcolor.teal,
    action: () => model.result.set("(filled)"),
    effects: { clicked: transitions.push() },
    ripple: false,
  },
  "VDivider": {
    width: em(0.2),
    color: zcolor.blue,
    height: pct(80),
  },
  "button4": {
    label: "Outlined",
    border: zborder.thin,
    color: zcolor.blue,
    events: { click: () => model.result.set("(outlined)") },
    effects: { clicked: transitions.bounce() },
    controlSize: "lg",
  },
  "button5": {
    label: "Disabled",
  },
  "DownButton": {
    label: "Hold me down",
    downAction: () => model.downCount.increment(),
    border: zborder.thin,
    color: zcolor.blue,
    controlSize: "med",
  },
  "down-label": {
    padding: zspace.s1,
    border: zborder.thin,
    textAlign: "center",
    minWidth: ch(3),
  },
  "result-label": {
    padding: zspace.s2,
    font: zfont.body_small,
    minWidth: ch(12),
  },
});
