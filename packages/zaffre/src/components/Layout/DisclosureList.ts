import { Atom, ZType, atom, counterAtomForDataSelection, toggleAtom } from ":foundation";
import { counterKeyBindings, View, core, defineComponentBundle, mergeComponentOptions, BV, restoreOptions } from ":core";
import { SelectionList, SelectionListOptions } from "./SelectionList";
import { Disclosure, DisclosureComponent, DisclosureOptions } from "./Disclosure";

// A DisclosureList is a selection list of Disclosure items. The functions to create the
// summary and detail components must be provided. These are used together to create a
// disclosure component which manages the expansion of the summary and detail components.

export interface DisclosureListOptions extends SelectionListOptions {}
defineComponentBundle<DisclosureListOptions>("DisclosureList", "SelectionList", {
  background: core.color.surface,
  alignItems: "stretch",
  justifyContent: "start",
  border: core.border.thin,
});

export function DisclosureList<T>(
  data: ZType<T[]>,
  selectedItem: Atom<T | undefined>,
  summaryCreator: DisclosureComponent<T>,
  detailCreator: DisclosureComponent<T>,
  inOptions: BV<DisclosureListOptions> = {}
): View {
  const options = mergeComponentOptions("DisclosureList", inOptions);

  const currentIndex = counterAtomForDataSelection(data, selectedItem);

  // create a disclosure for each data item
  function DisclosureView(dataItem: T): View {
    const expanded = toggleAtom(false);
    const selected = atom(() => selectedItem.get() === dataItem);
    selected.addAction((b) => expanded.set(b));
    const options: DisclosureOptions = {
      clickAction: () => selectedItem.set(dataItem),
      expanded: expanded,
      selected: selected,
      border: core.border.thin,
      events: {
        keyBindings: counterKeyBindings(currentIndex),
      },
    };
    return Disclosure(dataItem, summaryCreator, detailCreator, options);
  }
  return restoreOptions(SelectionList(data, selectedItem, DisclosureView, options));
}
