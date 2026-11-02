import { Atom, TimeOfDay, Week, Month, nullish } from ":foundation";
import { addClass } from ":view";
import { GenericTextInput, TextInputOptions } from "./GenericTextInput";

//
// Three time-related inputs are included here. Each of these uses a standard input
// element, but the value used is not just a string, but an instance of one of the
// corresponding classes in DateTimeService:
//
//   TimeInput: TimeOfDay
//   WeekInput: Week
//   MonthInput Month
//

export const TimeInput = (time: Atom<TimeOfDay>, inOptions: TextInputOptions = {}) => {
  const options = addClass(inOptions, "TimeInput");
  options.inputType = "time";

  return GenericTextInput(
    time,
    (tm: TimeOfDay | nullish) => (tm ? tm.toString() : ""),
    (text: string | nullish) => TimeOfDay.fromString(text || ""),
    <TextInputOptions>options,
  );
};

export const WeekInput = (week: Atom<Week>, inOptions: TextInputOptions = {}) => {
  const options = addClass(inOptions, "WeekInput");
  options.inputType = "week";
  return GenericTextInput(
    week,
    (wk: Week | nullish) => (wk ? wk.toString() : ""),
    (text: string | nullish) => Week.fromString(text || ""),
    <TextInputOptions>options,
  );
};

export const MonthInput = (month: Atom<Month>, inOptions: TextInputOptions = {}) => {
  const options = addClass(inOptions, "MonthInput");
  options.inputType = "month";
  return GenericTextInput(
    month,
    (mon: Month | nullish) => (mon ? mon.toString() : ""),
    (text: string | nullish) => Month.fromString(text || ""),
    <TextInputOptions>options,
  );
};
