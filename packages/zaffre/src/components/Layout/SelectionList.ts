import { Atom, ZType, CounterAtom, TAction, counterAtomForDataSelection } from ":foundation";
import { BV, View, core, defineBaseOptions, mergeComponentOptions } from ":core";
import { StackOptions, VStack } from "./Stack";
import { ViewList } from "./ViewList";

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
defineBaseOptions<SelectionListOptions>("SelectionList", "VStack", {
  background: core.color.surface,
  alignItems: "stretch",
  justifyContent: "start",
  border: core.border.thin,
});

export function SelectionList<T>(
  data: ZType<T[]>,
  selectedItem: Atom<T | undefined>,
  itemCreator: (item: T, index: number) => View,
  inOptions: BV<SelectionListOptions> = {}
): View {
  const options = mergeComponentOptions("SelectionList", inOptions);

  // TODO
  const currentIndex = counterAtomForDataSelection(data, selectedItem);

  return VStack(options).append(
    ViewList(
      data,
      (dataItem) => dataItem,
      (dataItem, index) => itemCreator(dataItem, index)
    )
  );
}
