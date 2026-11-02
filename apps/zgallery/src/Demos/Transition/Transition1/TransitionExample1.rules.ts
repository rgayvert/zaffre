import { zborder, zrounding, zspace, BoxOptions, StackOptions, ch, zcolor, ButtonOptions, zfont, Effect } from "zaffre";
import { TransitionModel1 } from "./TransitionModel1";

export const transitionBoxRules = (model: TransitionModel1, effect: Effect) => {
  return {
    "VStack": {
      padding: zspace.s4,
      alignItems: "center",
    } satisfies StackOptions,
    "TextLabel": {
      font: zfont.body_medium,
    },
    "outer-box": {
      border: zborder.thin, 
      width: ch(11),
      height: ch(11),
      padding: zspace.s1,
    } satisfies BoxOptions,
    "inner-box": {
      hidden: model.effectsHidden, // the trigger
      rounding: zrounding.none,
      width: ch(10),
      height: ch(10),
      border: zborder.thin,
      overflow: "hidden",
      background: zcolor.primary,
      effects: { hidden: effect }, // effect to use when visiblity changes
    } satisfies BoxOptions,
  };
};

export const transitionExample1Rules = (model: TransitionModel1) => {
  return {
    "Button": {
      marginInlineStart: zspace.s7,
      label: "Toggle",
      action: () => model.toggleHidden(),
    } satisfies ButtonOptions,
  };
};
