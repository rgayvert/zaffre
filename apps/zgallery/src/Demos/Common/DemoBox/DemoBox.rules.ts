import { OptionRules, pct, StackOptions, zborder, zcolor, zspace } from "zaffre";

export interface DemoBoxOptions extends StackOptions {}

export const demoBoxRules: OptionRules = {
  "DemoBox": {
    width: pct(95),
    //maxWidth: ch(120),
    marginTop: zspace.s3,
    border: zborder.thin.color(zcolor.gray.opacity(0.5)),
  } satisfies DemoBoxOptions,
  "DemoBox>Resettable": {
    background: zcolor.background,
  },
};
