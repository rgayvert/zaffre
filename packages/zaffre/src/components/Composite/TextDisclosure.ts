import { zstring, ZType, atom, zget, ToggleAtom, Atom, zboolean, znumber } from ":foundation";
import { addClass } from ":core";
import { Disclosure, DisclosureOptions, DisclosureViewFn } from "../Layout";
import { ExpansionLabel } from "./ExpansionLabel";

//
// A TextDisclosure is a disclosure which has a label
// with a disclosure icon (a button). The detail creator must be supplied.
//

export interface TextDisclosureOptions extends DisclosureOptions {
  expanded?: ToggleAtom;
  iconName?: zstring;
  iconSide?: "left" | "right";
  iconHidden?: Atom<boolean>;
  initiallyCollapsed?: boolean;
  alwaysExpand?: Atom<boolean>;
  stayOpen?: zboolean;
  toggleOnSummaryClick?: zboolean;
  expandOnSummaryClick?: zboolean;
  selectOnDetailClick?: zboolean;
  collapseDuration?: znumber;
  expansionDisabled?: zboolean;
  summaryInset?: zstring;
  centerSummary?: zboolean;
}

export const TextDisclosure = <T>(
  data: ZType<T>,
  expanded: ToggleAtom,
  label: zstring,
  detailCreator: DisclosureViewFn<T>, 
  inOptions: TextDisclosureOptions = {}
) => {

  const textDisclosureOptions = addClass(inOptions, "TextDisclosure");
  textDisclosureOptions.expanded = expanded;

  const DisclosureLabel = () => {
    return ExpansionLabel(label, {
      clickAction: () => expanded.toggleAsync(),
      selected: textDisclosureOptions.selected,
      iconName: () => zget(textDisclosureOptions.iconName) || "icon.chevron-right",
    });
  }

  return Disclosure(data, expanded, () => DisclosureLabel(), detailCreator, textDisclosureOptions);
}
