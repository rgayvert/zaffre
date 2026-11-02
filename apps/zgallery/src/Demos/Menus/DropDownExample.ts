import { ComboBox, DropDownButton, HStack, MenuButton, SVGAvatar, atom, ch, simpleMenuItemList } from "zaffre";
import { px, zcolor, zspace } from "zaffre";

export const DropDownExample = () => {
  const selection1 = atom("First choice");
  const choices = ["First choice", "Second choice", "Third choice"];
  const choice1 = simpleMenuItemList(choices, selection1);
  const selection2 = atom("");
  const choice2 = simpleMenuItemList(["", ...choices], selection2);
  const selection3 = atom("");
  const choice3 = simpleMenuItemList(["Athens", "Atlanta", "Macon", "Savannah"], selection3);

  const choice = atom("");
  const picker = simpleMenuItemList(["Option 1", "Option 2"], choice);
  const avatar = SVGAvatar("AB", {
    width: px(24),
    height: px(24),
    bgColor: zcolor.red,
    textColor: zcolor.white,
    circular: true,
  });

  return HStack({ gap: zspace.s6 }).append(
    DropDownButton(choice1, { minWidth: ch(12) }),
    DropDownButton(choice2, { minWidth: ch(12) }),
    MenuButton(picker, { avatar: avatar }),
    ComboBox(choice, choice3),
    DropDownButton(choice3, { minWidth: ch(12), newAction: () => alert("add") }),

  );
};
