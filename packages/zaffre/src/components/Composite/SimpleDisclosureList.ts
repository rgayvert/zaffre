import { zget, zboolean, Atom, ZType, atom } from ":foundation";
import { counterAtomForDataSelection, toggleAtom, ToggleAtom } from ":foundation";
import { View, counterKeyBindings, core, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { DisclosureComponent, SelectionList, SelectionListOptions } from "../Layout";
import { SimpleDisclosure, SimpleDisclosureOptions } from "./SimpleDisclosure";

// A SimpleDisclosureList is a list of SimpleDisclosure items, each of which has a text label
// with a disclosure icon as its summary component. The detail creator must be supplied; in the
// simplest case, this may just creates a TextBox.
//
// To enable accordion-style behavior, set the allowMultipleExpansions option to false.
//
// TODO:
//  1. Improve keyboard navigation: add right-arrow to toggle
//  2. Simplify this by going straight to LabelWithIcons
//

export interface SimpleDisclosureListOptions extends SelectionListOptions {
  allowMultipleExpansions?: zboolean;
}
defineComponentDefaults<SimpleDisclosureListOptions>("SimpleDisclosureList", "SelectionList", {
  background: core.color.surface,
  alignItems: "stretch",
  justifyContent: "start",
  border: core.border.thin,
  allowMultipleExpansions: true,
});

export function SimpleDisclosureList<T>(
  data: ZType<T[]>,
  selectedItem: Atom<T | undefined>,
  labelFn: (item: T) => string,
  detailCreator: DisclosureComponent<T>,
  inOptions: SimpleDisclosureListOptions = {}
): View {
  const options = mergeComponentDefaults("SimpleDisclosureList", inOptions);
  options.model = [data, selectedItem];

  // support keyboard navigation
  const currentIndex = counterAtomForDataSelection(data, selectedItem);

  function handleClick(dataItem: T, expanded: ToggleAtom): void {
    expanded.toggle();
    selectedItem.set(dataItem);
  }

  function DisclosureLabel(dataItem: T): View {
    const expanded = toggleAtom(false);
    const selected = atom(() => selectedItem.get() === dataItem);
    if (!zget(options.allowMultipleExpansions)) {
      selected.addAction((b) => expanded.set(b));
    } else {
      selected.addAction((b) => b && expanded.set(b));
    }
    const disclosureOptions: SimpleDisclosureOptions = {
      clickAction: () => handleClick(dataItem, expanded),
      expanded: expanded,
      selected: selected,
      labelSelectionColor: core.color.yellow,
      border: core.border.thin,
      events: {
        keyBindings: counterKeyBindings(currentIndex),
      },
    };
    return SimpleDisclosure(dataItem, labelFn(dataItem), detailCreator, disclosureOptions);
  }
  return SelectionList(data, selectedItem, DisclosureLabel, options);
}
