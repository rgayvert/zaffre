import { atom, Week, WeekInput } from "zaffre";
import { InputExampleBox } from "./InputExampleBox";

export const WeekInputExample = () => {
  const week = atom(new Week(2024, 12));
  return InputExampleBox(
    atom(() => week.get().toString()),
    undefined,
    WeekInput(week)
  );
}
