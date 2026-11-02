import { atom, DateTimeInput, DateTimeFormatter } from "zaffre";
import { InputExampleBox } from "./InputExampleBox";

export const DateTimeInputExample = () => {
  const dateTime = atom(new Date("2023-07-21T07:15:00.000Z"));
  const formatter = DateTimeFormatter("YYYY-MM-DDThh:mm");
  return InputExampleBox(
    atom(() => formatter(dateTime.get())),
    undefined,
    DateTimeInput(dateTime)
  );
}
