import { em, ScrollPane, TextBox, pct, atom, lorem, VStack, HStack, RadioGroup, zborder, zspace } from "zaffre";

export const TextExample1 = () => {
  const content = atom(lorem.sentences(200));
  const capitalized = atom("normal");
  const capitalize = (s: string) => {
    return capitalized.get() === "capitalized" ? s.toUpperCase() : s;
  }
  return VStack({ gap: zspace.s5 }).append(
    ScrollPane({ width: pct(100), height: pct(100) }).append(
      TextBox(content, {
        border: zborder.thin,
        padding: zspace.s4,
        height: em(12),
        textTransformFn: capitalize,
      })
    ),
    HStack().append(RadioGroup(capitalized, ["normal", "capitalized"]))
  );
};
