import { zget, zstring, ZType } from ":foundation";
import { ch, css_space, em, View, core, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { HStack, Spacer, StackOptions, ViewList, VStack } from "../Layout";
import { TextLabel, TextLabelOptions } from "../Content";

//
// A LabeledList component is a stack of controls with aligned labels
//
//
// TODO: it would be more consistent for a LabeledList to have the pairs appended, like LabeledBox
//

export type LabelViewPair = [zstring, View];

export interface LabeledListOptions extends StackOptions {
  labelSide?: "left" | "right"; // TODO: BoxSide - top/bottom becomes 1 column stack
  labelOptions?: TextLabelOptions;
  labelGap?: css_space;
}
defineComponentDefaults<LabeledListOptions>("LabeledList", "Stack", {
  alignItems: "stretch",
  justifyContent: "start",
  labelSide: "left",
  gap: em(0.5),
  labelOptions: {
    background: core.color.inherit,
    font: core.font.body_medium,
    border: core.border.none,
    marginRight: ch(1),
  },
});

export function LabeledList(entries: ZType<LabelViewPair[]>, inOptions: LabeledListOptions = {}): View {
  const options = mergeComponentDefaults("LabeledList", inOptions);

  function LabelPair(pair: LabelViewPair): View {
    const label = TextLabel(zget(pair[0]), options.labelOptions);
    const list = options.labelSide === "left" ? [label, Spacer(1), pair[1]] : [Spacer(1), label, pair[1]];
    return HStack({ background: core.color.inherit }).append(...list);
  }

  return VStack(options).append(
    ViewList(
      entries,
      (pair) => pair[0],
      (pair) => LabelPair(pair)
    )
  );
}

export type SimpleLabelViewPair = [zstring, zstring];

export interface SimpleLabeledListOptions extends LabeledListOptions {}
defineComponentDefaults<SimpleLabeledListOptions>("SimpleLabeledList", "LabeledList", {});

export function SimpleLabeledList(entries: SimpleLabelViewPair[], inOptions: SimpleLabeledListOptions = {}): View {
  const options = mergeComponentDefaults("SimpleLabeledList", inOptions);
  const views = entries.map(([_key, value]) => TextLabel(value, options.labelOptions));
  const viewEntries = entries.map(([key, value], index) => [key, views[index]]) as LabelViewPair[];
  return LabeledList(viewEntries, options);
}
