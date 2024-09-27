import { DropDownButton, HStack, View, atom, ch, core } from "zaffre";

export function DropDownExample(): View {
  const choice1 = atom("");
  const choice2 = atom("");
  const choices1 = ["First choice", "Second choice", "Third choice"];
  const choices2 = ["", "First choice", "Second choice", "Third choice"];

  return HStack({ gap: core.space.s6 }).append(
    DropDownButton(choice1, choices1),
    DropDownButton(choice2, choices2, { minWidth: ch(12) })
  );

}
