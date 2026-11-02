import { PickList, zget, zstring } from ":foundation";
import { Stack, StackOptions, ViewList } from "../Layout";
import { addClass } from ":view";
import { Button, ButtonOptions } from "../Controls";
import { TextLabel } from "../Content";

export interface ButtonChoicePanelOptions extends StackOptions {
  panelTitle?: zstring;
}

export const ButtonChoicePanel = <T>(pickList: PickList<T>, inOptions: ButtonChoicePanelOptions = {}) => {
  const options = addClass(inOptions, "ButtonChoicePanel");
  options.model = pickList;

  const ChoiceButton = (value: T) => {
    const index = pickList.indexOfValue(value);
    const label = pickList.labelAtIndex(index);
    const buttonOptions: ButtonOptions = {
      label: label,
      action: () => pickList.select(value),
      hidden: !label,
    };
    return Button(buttonOptions);
  };
  return Stack(options).append(
    options.panelTitle ? TextLabel(options.panelTitle, { cls: "Title", hidden: () => !zget(options.panelTitle) }) : undefined,
    ViewList(
      pickList.values,
      (value) => value,
      (value, _index) => ChoiceButton(value),
      { noCache: true },
    ),
  );
};
