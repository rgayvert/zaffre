import { ch, em, px } from ":attributes";
import { SampleListBoxModel } from "./ListBoxExample.model";
import { zfont, zrounding, zspace } from ":theme";

export const listBoxExampleRules = (model: SampleListBoxModel) => ({
  "container": {
    gap: zspace.s7,
  },
  "Button": {
    width: ch(10),
    rounding: zrounding.pill,
  },
  "ListBox": {
    dblClickAction: (item: string) => model.removeListItem(item),
    maxHeight: em(10),
    overflow: "auto",
    padding: zspace.s1,
    font: zfont.body_medium,
  },
  "ListBox>TextLabel": {
    padding: zspace.s0,
  },
  "buttons": {
    gap: em(1),
    margin: zspace.s5,
  },
  "add-button": {
    label: "Add Item",
    action: () => model.addListItem(),
  },
  "sort-button": {
    label: "Sort",
    action: () => model.sort(),
  },
});
