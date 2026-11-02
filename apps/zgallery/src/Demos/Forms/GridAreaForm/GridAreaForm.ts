import { Form, pct, FormOptions, FormModel, atom, recordAtom, Switch, HStack, zspace, TextLabel, VStack, LabelBox } from "zaffre";
import { demoUserFieldsWithGridAreas, demoUserSchema, initialDemoUser } from "../../Common";

export const GridAreaForm = () => {

  const opts: FormOptions = {
    width: pct(90),
  };
  const disabled = atom(false);
  const readOnly = atom(false);
  
  const ra = recordAtom(initialDemoUser());
  const fields = demoUserFieldsWithGridAreas(ra);
  const formModel = new FormModel(ra, fields, { schema: demoUserSchema, readOnly: readOnly });

  return HStack({ padding: zspace.s3, gap: zspace.s8 }).append(
    VStack().append(
      LabelBox("Disabled: ").append(Switch(disabled)),
      LabelBox("Readonly: ").append(Switch(readOnly)),
    ),
    Form(formModel, opts)
  );
}
  