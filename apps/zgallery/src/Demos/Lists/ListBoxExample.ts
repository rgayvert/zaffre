import { Button, arrayAtom, atom, StringListBox, em, HStack, BasicAction, ch } from "zaffre";
import { VStack, View, core, lorem, zutil } from "zaffre";

class ListBoxModel {
  loremList = arrayAtom(zutil.sequence(0, 5).map((i) => lorem.words(i + 2)));
  selectedItem = atom("", { action: (item) => console.log("selection: " + item) });

  removeListItem(item: string): void {
    this.loremList.delete(item);
  }
  addListItem(): void {
    this.loremList.push(lorem.words(5));
  }
  sort(): void {
    this.loremList.toggleSort();
  }
}

export function ListBoxExample(): View {
  const model = new ListBoxModel();

  function ActionButton(label: string, action: BasicAction): View {
    return Button({ 
      label: label, 
      width: ch(10), 
      rounding: core.rounding.pill, 
      action: action,
    });
  }

  return HStack({ gap: core.space.s7 }).append(
    StringListBox(model.loremList, model.selectedItem, {
      dblClickAction: (item) => model.removeListItem(<string>item),
      maxHeight: em(10),
      overflow: "auto",
      padding: core.space.s2,
      font: core.font.body_medium,
    }),
    VStack({ gap: em(1), margin: core.space.s5 }).append(
      ActionButton("Add Item", () => model.addListItem()),
      ActionButton("Sort", () => model.sort()),
    )
  );
}
