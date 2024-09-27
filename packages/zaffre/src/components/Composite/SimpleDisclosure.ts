import { zboolean, znumber, zstring, ZType, atom, Atom, toggleAtom, ToggleAtom } from ":foundation";
import { pct, Effect, View, core, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { Disclosure, DisclosureOptions, DisclosureComponent } from "../Layout";
import { ExpandableItem, ExpandableItemOptions } from "./ExpandableItem";

//
// A SimpleDisclosure is a disclosure which has a text label 
// with a disclosure icon. The detail creator must be supplied.
//
// TODO: consider going straight to a LabelWithIcons instead of ExpandableItem.
//

export interface SimpleDisclosureOptions extends DisclosureOptions {
  expanded?: ToggleAtom;
  iconName?: zstring;
  iconSide?: "left" | "right";
  iconHidden?: Atom<boolean>;
  extraLabelClasses?: string;
  initiallyCollapsed?: boolean;
  alwaysExpand?: Atom<boolean>;
  stayOpen?: zboolean;
  onHover?: ZType<Effect>;
  toggleOnSummaryClick?: zboolean;
  expandOnSummaryClick?: zboolean;
  selectOnDetailClick?: zboolean;
  collapseDuration?: znumber;
  expansionDisabled?: zboolean;
  summaryInset?: zstring;
  centerSummary?: zboolean;
}
defineComponentDefaults<SimpleDisclosureOptions>("SimpleDisclosure", "Disclosure", {
  flexDirection: "column",
  alignItems: "start",
  iconName: "icon.chevron-right",
  iconSide: "right",
  width: pct(100),
  initiallyCollapsed: true,
  stayOpen: false,
  outline: core.border.none,
  collapseDuration: 0.2,
  toggleOnSummaryClick: true,
  selectOnDetailClick: true,
  overflow: "hidden",
});

export function SimpleDisclosure<T>(data: ZType<T>, label: zstring, detailCreator: DisclosureComponent<T>, inOptions: SimpleDisclosureOptions = {}): View {
  const options = mergeComponentDefaults("SimpleDisclosure", inOptions);

  const expanded = options.expanded || toggleAtom(false);
  options.expanded = expanded;

  function handleClick(): void {
    expanded.toggleAsync();
  }

  const expandableOptions: ExpandableItemOptions = {
    label: label,
    extraLabelClasses: options.extraLabelClasses,
    clickAction: options.clickAction || (() => handleClick()),
    expanded: expanded,
    selected: options.selected,
    padding: core.space.s1,
    width: pct(100),
    iconName: options.iconName,
    iconSide: options.iconSide,
    iconTransform: atom(() => expanded.get() ? "rotate(90deg)" : ""),
    iconTransition: "transform 0.3s",
  };

  return Disclosure(data, () => ExpandableItem(expandableOptions), detailCreator, options);
}
