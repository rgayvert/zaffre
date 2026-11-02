import { DateInput, atom, DateTimeFormatter } from "zaffre";
import { InputExampleBox } from "./InputExampleBox";

export const DateInputExample = () => {
  const date = atom(new Date(2024, 7, 21));
  return InputExampleBox(
    atom(() => DateTimeFormatter("YYYY-MM-DD")(date.get())),
    undefined, 
    DateInput(date)
  );
}
