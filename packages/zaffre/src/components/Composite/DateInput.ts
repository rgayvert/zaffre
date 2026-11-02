import { Atom, DateTimeFormatter, nullish, zutil } from ":foundation";
import { px, beforeAddedToDOM, zborder, zfont, addClass } from ":core";
import { Button } from "../Controls";
import { HStack } from "../Layout";
import { InputType } from "../Content";
import { GenericTextInput, TextInputOptions } from "../Inputs/GenericTextInput";

//
// A ChronoInput is the base component for DateInput and DateTimeInput. In either case
// the value is a Date object. This uses the native browser pickers. The picker icon can
// be the default (inside), or a custom icon (outside). In the latter case, a special
// style must be applied to hide the native picker icon.
//

// TODO: useNativePickerIcon is not picked up from root options, so we need an assembly

export interface ChronoInputOptions extends TextInputOptions {
  iconName?: string;
  useNativePickerIcon?: boolean;
}

const ChronoInput = (date: Atom<Date | null>, inputType: InputType, inOptions: ChronoInputOptions = {}) => {
  const options = addClass(inOptions, "ChronoInput");
  options.inputType = inputType;
  date.options.validateValue = (dt) => zutil.isValidDate(dt);

  const dateFromShortString = (s: string): Date | null => {
    const parts = s.split("-").map((p) => parseInt(p));
    const dt = new Date(parts[0], parts[1] - 1, parts[2]);
    return zutil.isValidDate(dt) ? dt : null;
  };

  const formatter = inputType === "date" ? DateTimeFormatter("YYYY-MM-DD") : DateTimeFormatter("YYYY-MM-DDTHH:mm");
  const parser = inputType === "date" ? (s: string | nullish) => dateFromShortString(s || "") : (s: string | nullish) => new Date(s || "");

  let inputElt: HTMLInputElement;

  beforeAddedToDOM(options, (view): void => {
    inputElt = <HTMLInputElement>view.elt;
  });
  
  // If setOnInput is true, we get invalid dates when changing the year
  // What we need is "setOnValidInput" which would trigger actions when the date is valid

  options.setOnInput = false; 

  if (options.useNativePickerIcon) {
    return GenericTextInput(date, formatter, parser, options);
  } else {
    // see ZStyleSheet for webkit rule
    options.extraVars = [["--picker-display", "none"]];
    return HStack({ font: zfont.title_medium, gap: px(3) }).append(
      GenericTextInput(date, formatter, parser, options),
      Button({
        leadingIconURI: () => options.iconName || "",
        action: () => inputElt.showPicker(),
        background: undefined,
        border: zborder.none,
        font: zfont.inherit,
      })
    );
  }
};

export const DateInput = (date: Atom<Date | null>, inOptions: ChronoInputOptions = {}) => {
  const options = addClass(inOptions, "DateInput");
  return ChronoInput(date, "date", options);
};

export const DateTimeInput = (date: Atom<Date>, inOptions: ChronoInputOptions = {}) => {
  const options = addClass(inOptions, "DateTimeInput");
  return ChronoInput(date, "datetime-local", options);
};


