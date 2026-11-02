import { PickList, SimpleAction, TAction } from ":foundation";
import { addClass, zcolor } from ":core";
import { SelectionList, SelectionListOptions } from "../Layout";
import { TextLabel } from "../Content";

export interface ListBoxOptions extends SelectionListOptions {
  dblClickAction?: TAction<unknown>;
  onClick?: SimpleAction;
}

export const ListBox = <T>(list: PickList<T>, inOptions: ListBoxOptions = {}) => {
  const options = addClass(inOptions, "ListBox");
  options.model = list;

  const handleClick = (item: T, index: number) => {
    list.select(item);
    options.onClick?.(item, index);
  };

  const LabelItem = (item: T, index: number) => {
    return TextLabel(list.labelFn(item, index), {
      alignItems: options.alignItems,
      clickAction: () => handleClick(item, index),
      selected: () => list.selectedValue() === item,
      selectionColor: zcolor.secondaryContainer,
      effects: {},
      events: {
        dblClick: () => options.dblClickAction?.(item),
      },
    });
  };
  return SelectionList(list, LabelItem, options);
};
