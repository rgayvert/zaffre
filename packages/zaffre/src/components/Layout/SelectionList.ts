import { atom, CounterAtom, PickList, TAction } from ":foundation";
import { addClass, addOptionEvents, pickListKeyBindings, View } from ":core";
import { VStack } from "./Stack";
import { ViewList } from "./ViewList";
import { StackOptions } from "./Stack";

//
// A SelectionList is a VStack containing a generic list of items, along with a generic item creator.
// This acts as a base component for ListBox and DisclosureList and their derivatives.
//
// TODO: add keyboard navigation
//

export interface SelectionListOptions extends StackOptions {
  dblClickAction?: TAction<unknown>;
  currentIndex?: CounterAtom;
}

export const SelectionList = <T>(
  list: PickList<T>,
  itemCreator: (item: T, index: number) => View,
  inOptions: SelectionListOptions = {}
) => {
  const options = addClass(inOptions, "SelectionList");
  options.model = list;
  options.tabIndex ??= 0;

  addOptionEvents(options, {
    keyBindings: pickListKeyBindings(list),
  });

  //const values = atom(() => list.values.filter((v) => !!v));

  return VStack(options).append(
    ViewList(
      list.values,
      (item, index) => `${list.labelAtIndex(index)}-${index}`,
      (item, index) => itemCreator(item, index)
    )
  );
};
