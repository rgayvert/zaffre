import { core, View, VStack, TextLabel, atom, NumberInput, LabeledList, LabelViewPair, TextInputOptions, pct, ch, zutil } from "zaffre";
import PythagorusWorker from "./Pythagorus?worker&inline";
import { PythagorusModel } from "./Pythagorus";

export function WorkerExample(): View {
  const model = new PythagorusModel(new PythagorusWorker());

  const inputOptions: TextInputOptions = {
    border: core.border.thin, 
    size: 4,
    textAlign: "right"
  };
  const entries: LabelViewPair[] = [
    ["A", NumberInput(model.a, inputOptions)],
    ["B", NumberInput(model.b, inputOptions)],
    ["C", TextLabel(atom(() => zutil.printRoundedTo(model.c.get(), 2).toString()), { 
      width: pct(100), 
      border: core.border.thin, 
      textAlign: "right",
      paddingRight: ch(1),
    })]
  ];

  return VStack({ gap: core.space.s5 }).append(
    LabeledList(entries)
  );
}
