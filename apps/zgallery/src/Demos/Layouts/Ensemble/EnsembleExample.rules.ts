import { Atom, ch, colorToken, pct, PickList, rounding, SwitchOptions, zcolor, zrounding, zspace } from "zaffre";

export const ensembleExampleRules = (model: Atom<string | null>) => ({
  "CenteredText": {
    width: pct(100),
    height: ch(12),
    background: () => colorToken({ cssName: model.get() || "" }),
    color: zcolor.white,
    opacity: 0.5,
  },
});

export const toggleExampleRules = {
  "VStack": {
    width: ch(10),
    height: ch(12),
    gap: zspace.s3,
    justifyContent: "center",
  },
  "Switch": {
    controlSize: "sm",
  } satisfies SwitchOptions,
  "box1": {
    width: ch(5),
    height: ch(5),
    background: zcolor.red,
  },
  "box2": {
    width: ch(5),
    height: ch(5),
    rounding: zrounding.pill,
    background: zcolor.blue,
  },
};
