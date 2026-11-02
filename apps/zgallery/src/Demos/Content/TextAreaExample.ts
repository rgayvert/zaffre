import { pct, TextArea, atom, VStack, zfont, zspace } from "zaffre";

const sampleText1 = atom("Fixed size text area");
const sampleText2 = atom("TextLabel area with grow box");
const sampleText3 = atom("TextLabel area which grows or shrinks to fit the current value.");

export const TextAreaExample = () => {
  return VStack({ gap: zspace.s4 }).append(
    TextArea(sampleText1, { rows: 3, width: pct(50), font: zfont.title_medium, resize: "none" }),
    TextArea(sampleText2, { rows: 3, width: pct(50), font: zfont.title_medium, resize: "both" }),
    TextArea(sampleText3, { fluidHeight: true, rows: 3, cols: 40, font: zfont.title_medium, resize: "none" })
  );
}
