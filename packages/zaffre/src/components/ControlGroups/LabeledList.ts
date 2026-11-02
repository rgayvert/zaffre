import { zget, zstring, ZType } from ":foundation";
import { addClass, css_space, View, zcolor } from ":core";
import { HStack, Spacer, StackOptions, ViewList, VStack } from "../Layout";
import { TextLabel, LabelOptions } from "../Content";

//
// A LabeledList component is a stack of controls with aligned labels
//
// TODO: it would be more consistent for a LabeledList to have the pairs appended, like LabeledBox
//

export type LabelViewPair = [zstring, View];

export interface LabeledListOptions extends StackOptions {
  labelSide?: "left" | "right"; // TODO: BoxSide - top/bottom becomes 1 column stack
  labelOptions?: LabelOptions;
  labelGap?: css_space;
}

export const LabeledList = (entries: ZType<LabelViewPair[]>, inOptions: LabeledListOptions = {}) => {
  const options = addClass(inOptions, "LabeledList");
  options.model = entries;

  const LabelPair = (pair: LabelViewPair) => {
    const label = TextLabel(zget(pair[0]), { cls: "LabeledList.TextLabel" });
    const list = options.labelSide === "left" ? [label, Spacer(1), pair[1]] : [Spacer(1), label, pair[1]];
    return HStack({ background: zcolor.inherit }).append(...list);
  };

  return VStack(options).append(
    ViewList(
      entries,
      (pair) => pair[0],
      (pair) => LabelPair(pair),
    ),
  );
};

export type SimpleLabelViewPair = [zstring, zstring];

export interface SimpleLabeledListOptions extends LabeledListOptions {}

export const SimpleLabeledList = (entries: SimpleLabelViewPair[], inOptions: SimpleLabeledListOptions = {}) => {
  const options = addClass(inOptions, "SimpleLabeledList");
  options.model = entries;

  const views = entries.map(([_key, value]) => TextLabel(value, options.labelOptions));
  const viewEntries = entries.map(([key, value], index) => [key, views[index]]) as LabelViewPair[];
  return LabeledList(viewEntries, options);
};
