import { ch,core, createOptionSheet } from "zaffre";
import { StackOptions, TextInputOptions, TextLabelOptions } from "zaffre";

export const hwSheet1 = createOptionSheet({
  "VStack": <StackOptions>{
    padding: core.space.s6,
    gap: core.space.s6,
    maxWidth: ch(120),
  },
  "TextInput": <TextInputOptions>{
    rounding: core.rounding.pill,
    border: core.border.thin,
    textAlign: "center",
    font: core.font.display_medium,
    placeholder: "Enter some text",
  },
  "TextLabel": <TextLabelOptions>{
    color: core.color.primary,
    font: core.font.headline_medium,
  },
});
