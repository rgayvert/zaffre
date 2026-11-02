import { pct, Form, FormModel, Button, HStack, zspace, PlacedPair, atom, recordAtom, zborder, zcolor, DefaultButton } from "zaffre";
import { demoUserFields, demoUserSchema, initialDemoUser } from "../../Common";
import { columnAreaFormRules } from "./ColumnAreaForm.rules";

export const ColumnAreaForm = () => {
  const ra = recordAtom(initialDemoUser());
  const fields = demoUserFields(ra);
  const formModel = new FormModel(ra, fields, { schema: demoUserSchema });

  const toolbar = HStack({ marginTop: zspace.s8, gap: zspace.s5 }).append(
    Button({ label: "Reset", action: () => formModel.reset(), disabled: formModel.resetDisabled }),
    DefaultButton(formModel, {
      label: "Submit",
      action: () => alert(JSON.stringify(formModel.values())),
      disabled: formModel.submitDisabled,
    }),
  );

  return PlacedPair(Form(formModel, { templateColumns: "auto 1fr auto 1fr" }), toolbar, "yend", "center", {
    width: pct(90),
    rules: columnAreaFormRules,
  });
};
