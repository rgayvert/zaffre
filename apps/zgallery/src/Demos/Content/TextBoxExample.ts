import { core, View, TextBox, Spacer, HStack, lorem } from "zaffre";

const sampleText = lorem.redacted(30);
function loremText(header: string): string {
  return `${header}${sampleText}`;
}

export function TextBoxExample(): View {
  return HStack({ gap: core.space.s4 }).append(
    Spacer(),
    TextBox(loremText("Plain")),
    TextBox(loremText("Filled"), { background: core.color.teal }),
    TextBox(loremText("Outlined"), { border: core.border.thin, color: core.color.blue })
  );
}
