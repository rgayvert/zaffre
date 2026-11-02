import { PickList, ToggleAtom } from ":foundation";
import { DisclosureList, DisclosureListOptions, DisclosureOptions, DisclosureViewFn } from "../Layout";
import { TextDisclosure } from "./TextDisclosure";
import { addClass } from ":view";

// A TextDisclosureList is a list of TextDisclosure items, each of which has a label
// with a disclosure icon as its summary component. The detail creator must be supplied; in the
// simplest case, this just creates a TextBox.
//
// To enable accordion-style behavior, set the allowMultipleExpansions option to false.
//
// TODO:
//  1. Improve keyboard navigation: add right-arrow to toggle
//

export interface TextDisclosureListOptions extends DisclosureListOptions {}

export const TextDisclosureList = <T>(list: PickList<T>,
  detailCreator: DisclosureViewFn<T>,
  inOptions: TextDisclosureListOptions = {}
) => {
  const options = addClass(inOptions, "TextDisclosureList");

  const DisclosureFn = (item: T, expanded: ToggleAtom, options: DisclosureOptions) => {
    return TextDisclosure(item, expanded, list.labelFn(item), detailCreator, options);
  };
  return DisclosureList(list, DisclosureFn, options);
};
