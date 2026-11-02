import { PickList, ToggleAtom, atom, toggleAtom, zboolean, zget } from ":foundation";
import { addClass, View } from ":core";
import { SelectionList } from "./SelectionList";
import { DisclosureOptions } from "./Disclosure";
import { SelectionListOptions } from "./SelectionList";

// A DisclosureList is a selection list of Disclosure items. The functions to create the
// summary and detail components must be provided. These are used together to create a
// disclosure component which manages the expansion of the summary and detail components.

export interface DisclosureListOptions extends SelectionListOptions {
  allowMultipleExpansions?: zboolean;
}

type DisclosureCreatorFn<T> = (dataItem: T, expanded: ToggleAtom, options: DisclosureOptions) => View;

export const DisclosureList = <T>(list: PickList<T>, disclosureCreator: DisclosureCreatorFn<T>, inOptions: DisclosureListOptions = {}) => {
  const options = addClass(inOptions, "DisclosureList");
  options.model = list;

  const itemExpanded = (item: T) => {
    list.select(item);
  };

  // create a disclosure for each item
  const DisclosureView = (item: T) => {
    const expanded = toggleAtom(false);
    expanded.addAction(() => itemExpanded(item));

    const selected = atom(() => list.lastSelection.get() === item);

    if (!zget(options.allowMultipleExpansions)) {
      // accordion behavior
      selected.addAction((b) => expanded.set(b));
    } else {
      selected.addAction((b) => b && expanded.set(b));
    }

    const disclosureOptions = {
      selected: selected,
      // events: {
      //   keyBindings: counterKeyBindings(currentIndex),
      // },
    } satisfies DisclosureOptions;

    return disclosureCreator(item, expanded, disclosureOptions);
  };
  return SelectionList(list, DisclosureView, options);
};
