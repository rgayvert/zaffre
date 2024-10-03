import { Button, LabelBox, Spacer, TextInput, TextLabel, Switch, VStack, View, HStack } from "zaffre";
import { core, customFont, em, transitions } from "zaffre";
import { HelloModel2 } from "./HelloModel2";

export function HelloWorld2(): View {
  const model = new HelloModel2();
  return VStack({ alignItems: "center", gap: core.space.s5 }).append(
    Spacer(1),
    TextInput(model.text, {
      bundles: ["textinput1"],
      disabled: model.disabled,
      // rounding: core.rounding.r3,
      // border: core.border.thin,
      // setOnInput: model.setOnInput,
      // textAlign: "center",
      // font: core.font.display_medium,
      // placeholder: "Enter some text",
    }),
    TextLabel(model.text, {
      color: core.color.primary.tone(70),
      font: customFont({ name: "Sofia", size: 32 }),
      effects: { contentChanged: transitions.fadeIn("in", 2.0) },
    }),
    Spacer(core.space.s3),
    Button({
      label: "Reset",
      rounding: core.rounding.pill,
      action: () => model.reset(),
    }),
    HStack({ gap: core.space.s5 }).append(
      LabelBox("Disabled").append(Switch(model.disabled, { width: em(3) })),
      LabelBox("Set on Input").append(Switch(model.setOnInput, { width: em(3) })),
    ),
    Spacer(core.space.s3)
  );
}
