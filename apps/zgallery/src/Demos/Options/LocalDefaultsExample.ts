import { View, core, HStack, LabelBox, Box, ch, evaluateWithLocalDefaults } from "zaffre";

function BlueBox(): View {
  return Box({ background: core.color.blue, width: ch(2), height: ch(2) });
}
function LabelBox1(label: string): View {
  const localDefaults = {
      "TextLabel": {
        color: core.color.red,
      },
  };
  return evaluateWithLocalDefaults(localDefaults, () => LabelBox(label).append(BlueBox()));
}
function LabelBox2(label: string): View {
  const localDefaults = {
    //"LabelBox.TextLabel": {
    "TextLabel": {
        color: core.color.green,
     }
  };
  function BoxWithLabeledBox(label: string): View {
    return Box({ border: core.border.thin, padding: core.space.s3 }).append(
      LabelBox(label).append(BlueBox())
    );
  }
  return evaluateWithLocalDefaults(localDefaults, () => BoxWithLabeledBox(label));
}
export function LocalDefaultsExample(): View {
  return HStack({ gap: core.space.s9 }).append(
    LabelBox("Hello1").append(BlueBox()), 
    LabelBox1("Hello2"), 
    LabelBox2("Hello3"));
}
