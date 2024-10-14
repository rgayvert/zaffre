import { atom, core, recordEditor, Form, pct, View, FormOptions } from "zaffre";
import { DemoUserRecord } from "./DemoUserRecord";
import { demoUserFields } from "./DemoUserFields";

export function BasicFormExample(): View {
  const record = atom(new DemoUserRecord(undefined));
  const editor = recordEditor(record.get());
  const validationOn = atom(false);
  const opts: FormOptions = {
    width: pct(90),
    submitAction: () => alert(JSON.stringify(record.get())),
    validationOn: validationOn,
    formGridOptions: {
      labelBoxOptions: {
        textLabelOptions: {
          color: core.color.green
        }
      }
    }
  };

  return Form(record, editor, demoUserFields(), opts);
}
