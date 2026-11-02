import { atom, TimeInput, TimeOfDay } from "zaffre";
import { InputExampleBox } from "./InputExampleBox";

export const TimeInputExample = () => {
  const time = atom(new TimeOfDay(12, 34, 56));
  return InputExampleBox(
    atom(() => time.get().toString()), 
    undefined, 
    TimeInput(time),
  );
}
