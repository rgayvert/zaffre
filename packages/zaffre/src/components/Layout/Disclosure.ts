import { zget, ZType, ToggleAtom, znumber } from ":foundation";
import { transitions, ViewOptions, View, afterAddedToDOM, addClass, css_color } from ":core";
import { Box } from "../HTML";
import { VStack } from "./Stack";
import { StackOptions } from "./Stack";

//
// A Disclosure is a stack of a summary component followed by a detail component. This generic
// disclosure must be provided with a pair of view creators. The detail component will be hidden
// until the summary toggles the expanded atom.
//

export interface DisclosureOptions extends StackOptions {
  //expanded?: ToggleAtom;
  initiallyExpanded?: boolean;
  effectDuration?: znumber;
  labelSelectionColor?: css_color;
}

export type DisclosureViewFn<T> = (data: T, options?: ViewOptions) => View;

export const Disclosure = <T>(
  data: ZType<T>,
  expanded: ToggleAtom,
  summaryCreator: DisclosureViewFn<T>,
  detailCreator: DisclosureViewFn<T>,
  inOptions: DisclosureOptions = {}
) => {
  const options = addClass(inOptions, "Disclosure");
  options.model = data;

  options.initiallyExpanded && expanded.set(options.initiallyExpanded);
  const hidden = expanded.negation;

  afterAddedToDOM(options, (view): void => {
    view.getSelected().addAction((b) => b && view.scrollIntoViewIfNeeded());
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
};
