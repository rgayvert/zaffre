import { Atom, zget, zboolean, zstring, atom } from ":foundation";
import { css_background, px, View, pct } from ":core";
import { core, defineComponentBundle, mergeComponentOptions, BV, restoreOptions } from ":core";
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

export interface SegmentedOptions extends StackOptions {
  labels?: string[];
  iconNames?: string[];
  initialValue?: zstring;
  tooltips?: zstring[];
  ripple?: zboolean;
  buttonComponent?: (options: ButtonOptions) => View;
  buttonBackground?: css_background;
  disabledValues?: Atom<string[]>;
  buttonOptions?: ButtonOptions;
}
defineComponentBundle<SegmentedOptions>("SegmentedButton", "Stack", {
  padding: core.space.s0,
  border: core.border.thin,
  rounding: core.rounding.pill,
  background: core.color.outline,
  buttonBackground: core.color.primaryContainer,
  ripple: false,
  overflow: "hidden",
  selectionColor: core.color.primary.opacity(0.7),
  flexDirection: "row",
});

function SimpleButton(options: ButtonOptions): View {
  return Button({ label: options.label, ...options });
}

export function SegmentedButton(
  selectedValue: Atom<string | undefined>,
  values: string[],
  inOptions: BV<SegmentedOptions> = {}
): View {
  const options = mergeComponentOptions("SegmentedButton", inOptions);
  const labels = options.labels || values;

  const segmentedOptions = {
    ...options,
    selectionColor: undefined,
    gap: options.gap || px(1),
  };

  function setInitialValue(): void {
    const initialValue = zget(options.initialValue);

    // note: if we're using a segmented button for routing, when a route is triggered,
    // the selectedValue will have been set already
    if (initialValue && !selectedValue.get()) {
      selectedValue.set(initialValue);
    }
  }

  // factored out here to help in debugging
  function selectIndex(index: number): void {
    selectedValue.set(values[index]);
  }
  function SegmentButton(index: number): View {
    const buttonComponent = options.buttonComponent || SimpleButton;
    const disabled =
      options.disabled || options.disabledValues
        ? atom(() => zget(options.disabled) || zget(options.disabledValues)?.includes(values[index]) || false)
        : undefined;
    const buttonOptions: ButtonOptions = {
      ...options.buttonOptions,
      label: labels[index],
      leadingIconURI: options.iconNames?.[index],
      action: () => selectIndex(index),
      selected: atom(() => zget(selectedValue) === values[index]),
      tooltip: zget(options.tooltips)?.[index],
      tooltipPlacement: options.tooltipPlacement,
      ripple: options.ripple,
      background: options.buttonBackground || options.buttonOptions?.background,
      border: core.border.none,
      rounding: core.rounding.none,
      selectionColor: options.selectionColor,
      padding: core.space.s1,
      disabled: disabled,
      width: options.flexDirection === "column" ? pct(100) : undefined,
    };
    return buttonComponent(buttonOptions);
  }
  if (options.initialValue) {
    setTimeout(() => setInitialValue(), 10);
  }
  return restoreOptions(
    Stack(segmentedOptions).append(
      ViewList(
        values,
        (key) => key,
        (_key, index) => SegmentButton(index)
      )
    )
  );
}
