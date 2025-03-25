import { atom, core, Form, pct, View, FormOptions, FormField, zlog } from "zaffre";
import { DemoUserRecord } from "./DemoUserRecord";
import { demoUserFields } from "./DemoUserFields";

export function BasicFormExample(): View {
  const record = new DemoUserRecord(undefined);
  const validationOn = atom(false);
  function fieldChanged(field: FormField<unknown>): void {
    zlog.info("fieldValueChanged: "+field.label+" = "+field.value.get());
  }
  const opts: FormOptions = {
    width: pct(90),
    submitAction: () => alert(JSON.stringify(record.editableEntries())),
    validationOn: validationOn,
    formGridOptions: {
      labelBoxOptions: {
        textLabelOptions: {
          color: core.color.green,
        },
      },
      onChange: (field) => fieldChanged(field),
    },
  };

  return Form(record, demoUserFields(), opts);
}
