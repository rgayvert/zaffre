import { zget, atom, PickList, Atom, zstring, ZType, zboolean } from ":foundation";
import { addClass, pct, View } from ":core";
import { Stack, StackOptions, ViewList } from "../Layout";
import { ButtonOptions, Button } from "../Controls";

//
// A SegmentedButton is a stack of buttons that are coordinated with a selected atom
// so that only one may be selected at a time.
//
// For a simple variant, see TextSegmentedButton. This can be adapted for lots of
// uses, including tabs.
//
// TODO:
//  - implement icon variant
//  - switch to a generic data-viewcreator list where buttons may vary
//

export interface SegmentedButtonOptions<T> extends StackOptions {
  labelFn?: (v: T) => string;
  labels?: string[];
  iconNames?: string[];
  initialValue?: T;
  tooltips?: zstring[];
  //ripple?: zboolean;
  buttonCreator?: (options: ButtonOptions) => View;
  disabledValues?: ZType<T[]>;
}

const SimpleButton = (options: ButtonOptions) => {
  return Button({ label: options.label, ...options });
};

export const SegmentedButton = <T>(pickList: PickList<T>, inOptions: SegmentedButtonOptions<T> = {}) => {
  const options = addClass(inOptions, "SegmentedButton");
  options.model = pickList;

  const setInitialValue = (): void => {
    const initialValue = zget(options.initialValue);

    // note: if we're using a segmented button for routing, when a route is triggered,
    // the selectedValue will have been set already
    if (initialValue && !pickList.get()) {
      pickList.select(initialValue);
    }
  };

  // factored out here to help in debugging
  const selectValue = (value: T): void => {
    pickList.select(value);
  };

  const SegmentButton = (value: T) => {
    const index = pickList.indexOfValue(value);
    const buttonCreator = options.buttonCreator || SimpleButton;
    const disabled =
      options.disabled || options.disabledValues
        ? atom(() => zget(options.disabled) || zget(options.disabledValues)?.includes(pickList.valueAtIndex(index)!) || false)
        : undefined;
    const buttonOptions: ButtonOptions = {
      //cls: "SegmentedButton.Button",
      label: pickList.labelAtIndex(index),
      leadingIconURI: options.iconNames?.[index],
      action: () => selectValue(value),
      selected: () => pickList.lastSelection.get() === value,
      tooltip: zget(options.tooltips)?.[index],
      disabled: disabled,
      hidden: !value,
      width: options.flexDirection === "column" ? pct(100) : undefined,
      fontWeight: () => pickList.lastSelection.get() === value ? 600 : 400
    };
    return buttonCreator(buttonOptions);
  };
  if (options.initialValue) {
    setTimeout(() => setInitialValue(), 10);
  }

  return Stack(options).append(
    ViewList(
      pickList.values,
      (value) => value,
      (value, _index) => SegmentButton(value),
    ),
  );
};

