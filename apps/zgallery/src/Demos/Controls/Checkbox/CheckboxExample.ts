import { HStack, LabelBox, Checkbox, Spacer, TextLabel, ToggleAtom, addClass } from "zaffre";
import { CheckboxExampleModel } from "./CheckboxExampleModel";
import { checkboxExampleRules } from "./CheckboxExample.rules";

export const CheckboxExample = () => {
  const model = new CheckboxExampleModel();
  const options = addClass({}, "Checkbox1", checkboxExampleRules)

  const SampleCheckbox = (label: string, value: ToggleAtom) => {
    return LabelBox(label).append(Checkbox(value));
  };

  return HStack(options).append(
    SampleCheckbox("Option A", model.cbValueA),
    SampleCheckbox("Option B", model.cbValueB),
    Spacer("s7"),
    TextLabel(model.result, { cls: "result" })
  );
};
