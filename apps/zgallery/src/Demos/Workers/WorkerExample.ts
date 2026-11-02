import { VStack, TextLabel, atom, NumberInput, LabeledList, LabelViewPair } from "zaffre";
import { TextInputOptions, pct, ch, zutil, zborder, zspace } from "zaffre";
import PythagorusWorker from "./Pythagorus?worker&inline";
import { PythagorusModel } from "./Pythagorus";

export const WorkerExample = () => {
  const model = new PythagorusModel(new PythagorusWorker());

  const inputOptions: TextInputOptions = {
    border: zborder.thin,
    size: 4,
    textAlign: "right",
  };
  const entries: LabelViewPair[] = [
    ["A", NumberInput(model.a, inputOptions)],
    ["B", NumberInput(model.b, inputOptions)],
    [
      "C",
      TextLabel(
        atom(() => zutil.printRoundedTo(model.c.get(), 2).toString()),
        {
          width: pct(100),
          border: zborder.thin,
          textAlign: "right",
          paddingRight: ch(1),
        }
      ),
    ],
  ];

  return VStack({ gap: zspace.s5 }).append(LabeledList(entries));
};
