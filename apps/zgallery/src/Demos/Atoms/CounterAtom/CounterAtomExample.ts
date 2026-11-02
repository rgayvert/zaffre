import { TextLabel, atom, Button, HStack, addClass } from "zaffre";
import { counterAtom } from "zaffre";
import { rules } from "./CounterAtomExample.rules";

export const CounterAtomExample = () => {
  const N = counterAtom(1);
  const model = {
    N: N,
    N2: atom(() => N.get() * 2),
  };
  const options = addClass({}, "CounterAtom1", rules(model));

  return HStack(options).append(
    Button({ cls: "left-button" }),
    TextLabel(() => `n=${model.N.get()},&nbsp;&nbsp;n2=${model.N2.get()}`, { cls: "result" }),
    Button({ cls: "right-button" }),
  );
};
