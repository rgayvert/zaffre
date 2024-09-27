import { atom, core, recordEditor, evaluateWithLocalDefaults, Form, pct, View } from "zaffre";
import { DemoUserRecord } from "./DemoUserRecord";
import { demoUserFields } from "./DemoUserFields";

export function BasicFormExample(): View {
  const record = atom(new DemoUserRecord(undefined));
  const editor = recordEditor(record.get());
  const validationOn = atom(false);

  function BasicForm(): View {
    return Form(record, editor, demoUserFields(), {
      containerOptions: {
        width: pct(90),
      },
      submitAction: () => alert(JSON.stringify(record.get())),
      validationOn: validationOn,
      localDefaults: {
        "LabelBox.TextLabel": {
          color: core.color.purple,
        },
      },
    });
  }
  const localDefaults = {
    "TextLabel": {
      color: core.color.green,
    },
  };
  return evaluateWithLocalDefaults(localDefaults, () => BasicForm());
}
