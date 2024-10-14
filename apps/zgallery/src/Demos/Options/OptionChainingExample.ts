import { View, LabelBox, LabelBoxOptions, core, defineComponentBundle, ch, HStack } from "zaffre";
import { BV, mergeComponentOptions, BoxOptions, Box } from "zaffre";

interface SampleBoxOptions extends BoxOptions {
  labelBoxOptions?: LabelBoxOptions;
}
defineComponentBundle<SampleBoxOptions>("SampleBox", "Box", {
  border: core.border.thin,
  rounding: core.rounding.circle,
  padding: core.space.s5,
  labelBoxOptions: {
    placementPt: "xcenter-ystart",
    textLabelOptions: {
      color: core.color.green,
    },
  },
});

function SampleBox(text: string, inOptions: BV<SampleBoxOptions> = {}): View {
  const options = mergeComponentOptions("SampleBox", inOptions);
  const squareOpts = {
    background: core.color.blue,
    width: ch(3),
    height: ch(3),
  };
  return Box(options).append(LabelBox(text, options.labelBoxOptions).append(Box(squareOpts)));
}

export function OptionChainingExample(): View {
  const options2: SampleBoxOptions = {
    labelBoxOptions: {
      placementPt: "xstart-ycenter",
      textLabelOptions: {
        color: core.color.red,
      },
    },
  };
  return HStack("gap-5").append(SampleBox("label1"), SampleBox("label2", options2));
}
