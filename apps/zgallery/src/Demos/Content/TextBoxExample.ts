import { TextBox, Spacer, HStack, lorem, zcolor, zborder, zspace } from "zaffre";

const sampleText = lorem.redacted(30);
const loremText = (header: string) => {
  return `${header}${sampleText}`;
}

export const TextBoxExample = () => {
  return HStack({ gap: zspace.s4 }).append(
    Spacer(),
    TextBox(loremText("Plain")),
    TextBox(loremText("Filled"), { background: zcolor.teal }),
    TextBox(loremText("Outlined"), { border: zborder.thin, color: zcolor.blue })
  );
}
