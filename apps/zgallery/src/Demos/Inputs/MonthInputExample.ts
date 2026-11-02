import { atom, MonthInput, Month } from "zaffre";
import { InputExampleBox } from "./InputExampleBox";

export const MonthInputExample = () => {
  const month = atom(new Month(2024, 5));
  return InputExampleBox(
    atom(() => month.get().toString()),
    undefined,
    MonthInput(month)
  );
}
