import { atom, core, recordEditor, Form, pct, View } from "zaffre";
import { DemoUserRecord } from "./DemoUserRecord";
import { demoUserFields } from "./DemoUserFields";
import "./FormBundles";


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
  return BasicForm();
}
