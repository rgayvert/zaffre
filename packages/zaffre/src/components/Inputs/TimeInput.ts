import { Atom, TimeOfDay, Week, Month } from ":foundation";
import { View } from ":core";
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

export function TimeInput(time: Atom<TimeOfDay>, options: TextInputOptions = {}): View {
  return GenericTextInput(
    time,
    "time",
    (tm: TimeOfDay) => tm.toString(),
    (text: string) => TimeOfDay.fromString(text),
    options
  );
}
export function WeekInput(week: Atom<Week>, options: TextInputOptions = {}): View {
  return GenericTextInput(
    week,
    "week",
    (wk: Week) => wk.toString(),
    (text: string) => Week.fromString(text),
    options
  );
}

export function MonthInput(month: Atom<Month>, options: TextInputOptions = {}): View {
  return GenericTextInput(
    month,
    "month",
    (mon: Month) => mon.toString(),
    (text: string) => Month.fromString(text),
    options
  );
}
