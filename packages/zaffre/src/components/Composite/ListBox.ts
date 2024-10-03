import { Atom, ZType, TAction, atom, counterAtomForDataSelection, SimpleAction } from ":foundation";
import { View, counterKeyBindings, core, defineBaseOptions, mergeComponentOptions, BV,  } from ":core";
import { SelectionList, SelectionListOptions } from "../Layout";
import { LabelWithIcons } from "../Controls";

//
// TODO: find a way to avoid having to cast the item passed to dblClickAction
//

export interface ListBoxOptions extends SelectionListOptions {
  dblClickAction?: TAction<unknown>;
  onClick?: SimpleAction;
}
defineBaseOptions<ListBoxOptions>("ListBox", "SelectionList", {
  background: core.color.surface,
  alignItems: "stretch",
  justifyContent: "start",
  border: core.border.thin,
});

export function ListBox<T>(
  data: ZType<T[]>,
  selectedItem: Atom<T | undefined>,
  labelFn: (item: T, index: number) => string,
  inOptions: BV<ListBoxOptions> = {}
): View {
  const options = mergeComponentOptions("ListBox", inOptions);

  function handleClick(dataItem: T, index: number): void {
    selectedItem.set(dataItem);
    options.onClick?.(dataItem, index);
  }
  const currentIndex = counterAtomForDataSelection(data, selectedItem);

  function LabelComponent(dataItem: T, index: number): View {
    return LabelWithIcons({
      label: labelFn(dataItem, index),
      selectionColor: core.color.secondaryContainer,
      alignItems: options.alignItems,
      labelOptions: {
        padding: core.space.s0,
        font: core.font.inherit,
        //selectionColor: core.color.secondaryContainer,
      },
      clickAction: () => handleClick(dataItem, index),
      selected: atom(() => selectedItem.get() === dataItem),
      events: {
        dblClick: () => options.dblClickAction?.(dataItem),
        keyBindings: counterKeyBindings(currentIndex),
      },
    });
  }
  return SelectionList(data, selectedItem, LabelComponent, options);
}

export function StringListBox(
  data: ZType<string[]>,
  selectedItem: Atom<string>,
  options: SelectionListOptions = {}
): View {
  return ListBox(data, selectedItem, (item: string) => item, options);
}
