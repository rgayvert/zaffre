import { zget, znumber, ZType, toggleAtom, ToggleAtom } from ":foundation";
import { beforeAddedToDOM, transitions, View, ViewOptions, css_color, pct, BV } from ":core";
import { core, defineBaseOptions, mergeComponentOptions } from ":core";
import { Box } from "../HTML";
import { StackOptions, VStack } from "./Stack";

//
// A Disclosure is a stack of a summary component followed by a detail component. This generic
// disclosure must be provided with a pair of view creators. The detail component will be hidden
// until the summary toggles the expanded atom.
//

export type DisclosureComponent<T> = (data: T, options?: ViewOptions) => View;

export interface DisclosureOptions extends StackOptions {
  expanded?: ToggleAtom;
  initiallyExpanded?: boolean;
  effectDuration?: znumber;
  labelSelectionColor?: css_color;
}
defineBaseOptions<DisclosureOptions>("Disclosure", "VStack", {
  alignItems: "start",
  width: pct(100),
  outline: core.border.none,
  overflow: "hidden",
  initiallyExpanded: false,
  effectDuration: 0.2,
});

export function Disclosure<T>(
  data: ZType<T>,
  summaryCreator: DisclosureComponent<T>,
  detailCreator: DisclosureComponent<T>,
  inOptions: BV<DisclosureOptions> = {}
): View {
  const options = mergeComponentOptions("Disclosure", inOptions);

  const expanded = options.expanded || toggleAtom(options.initiallyExpanded!);
  const hidden = expanded.negation;

  beforeAddedToDOM(options, (view: View): void => {
    options.selected?.addAction((b) => b && view.scrollIntoViewIfNeeded());
  });

  const labelOptions = {
    selectionColor: options.labelSelectionColor,
  };

  // the detail pane needs a container with no padding in order for a height transition to work properly
  const detailContainer = Box({
    name: "DetailContainer",
    hidden: hidden,
    effects: { hidden: transitions.collapse("in&out", zget(options.effectDuration)) },
  }).append(detailCreator(zget(data)));

  return VStack(options).append(summaryCreator(zget(data), <ViewOptions>labelOptions), detailContainer);
}
