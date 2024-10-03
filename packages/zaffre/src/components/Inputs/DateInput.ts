import { Atom, DateTimeFormatter } from ":foundation";
import { View, px, beforeAddedToDOM, core, defineBaseOptions, mergeComponentOptions, BV } from ":core";
import { Button } from "../Controls";
import { HStack } from "../Layout";
import { InputType } from "../Content";
import { GenericTextInput, TextInputOptions } from "./GenericTextInput";

//
// A ChronoInput is the base component for DateInput and DateTimeInput. In either case
// the value is a Date object. This uses the native browser pickers. The picker icon can
// be the default (inside), or a custom icon (outside). In the latter case, a special
// style must be applied to hide the native picker icon.
//

export interface ChronoInputOptions extends TextInputOptions {
  iconName?: string;
  useNativePickerIcon?: boolean;
}
defineBaseOptions<ChronoInputOptions>("ChronoInput", "Input", {
  iconName: "icon.calendar",
  useNativePickerIcon: true,
  paddingLeft: core.space.s4,
});

function ChronoInput(date: Atom<Date>, inputType: InputType, inOptions: BV<ChronoInputOptions> = {}): View {
  const options = mergeComponentOptions("ChronoInput", inOptions);
  options.type = inputType;

  function dateFromShortString(s: string): Date {
    const parts = s.split("-").map((p) => parseInt(p));
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  const formatter = inputType === "date" ? DateTimeFormatter("YYYY-MM-DD") : DateTimeFormatter("YYYY-MM-DDTHH:mm");
  const parser = inputType === "date" ? (s: string) => dateFromShortString(s) : (s: string) => new Date(s);

  let inputElt: HTMLInputElement;

  beforeAddedToDOM(options, (view: View): void => {
    inputElt = <HTMLInputElement>view.elt;
  });
  if (options.useNativePickerIcon) {
    return GenericTextInput(date, inputType, formatter, parser, options);
  } else {
    // see ZStyleSheet for webkit rule
    options.extraVars = [["--picker-display", "none"]];
    return HStack({ font: core.font.title_medium, gap: px(3) }).append(
      GenericTextInput(date, inputType, formatter, parser, options),
      Button({
        leadingIconURI: options.iconName,
        action: () => inputElt.showPicker(),
        background: undefined,
        border: undefined,
        font: core.font.inherit,
      })
    );
  }
}

export function DateInput(date: Atom<Date>, options: ChronoInputOptions = {}): View {
  return ChronoInput(date, "date", options);
}

export function DateTimeInput(date: Atom<Date>, options: ChronoInputOptions = {}): View {
  return ChronoInput(date, "datetime-local", options);
}
