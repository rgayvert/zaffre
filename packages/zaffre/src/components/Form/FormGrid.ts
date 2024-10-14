import { Atom, RecordEditor, atom } from ":foundation";
import { gridAreaToString } from ":foundation";
import { View, em, pct, defineComponentBundle, mergeComponentOptions } from ":core";
import { BV, restoreOptions } from ":core";
import { Grid, GridOptions } from "../Layout";
import { LabelBox, LabelBoxOptions } from "../ControlGroups";
import { ValidationBox } from "./ValidationBox";
import { FormField, FormFieldCreators, formFieldIsValid, FormFieldSpecs } from "./FormField";
import { DefaultFormFieldFns } from "./FormInputs";

//
// A FormGrid contains a collection of input fields wrapped in validation boxes that are placed into a grid.
// The idea is to do this declaratively. Each field is defined by a FormFieldSpec, which provides:
//   - type and label, choices (if applicable)
//   - gridArea in which field is placed
//   - validators to apply
//
// The form is responsible for:
//   - style of fields (e.g., label position)
//   - mapping of field type to input component (e.g., type of input to use for a boolean type)
//
// There are default sets of validators and input mappings, but these can be extended or replaced.
//


export interface FormGridOptions extends GridOptions {
  fieldFns?: FormFieldCreators;
  validationOn?: Atom<boolean>;
  labelBoxOptions?: LabelBoxOptions;
}
defineComponentBundle<FormGridOptions>("FormGrid", "Grid", {
  fieldFns: DefaultFormFieldFns,
  gap: em(1),
  width: pct(100),
  labelBoxOptions: {
    placementPt: "xstart-ystart",
  }
});

export function FormGrid<R>(
  editor: RecordEditor<R>,
  fields: FormFieldSpecs<R>,
  inOptions: BV<FormGridOptions> = {}
): View {
  const options = mergeComponentOptions("FormGrid", inOptions);
  options.model = [editor, fields];

  function FormFieldView(property: keyof R, field: FormField<unknown>): View | undefined {
    const fieldFn = options.fieldFns!.get(field.type);
    field.value = editor[property];
    field.isValid = atom(() => formFieldIsValid(field));
    field.validationOn = options.validationOn;
    if (fieldFn) {
      field.view = LabelBox(field.label, {
        ...options.labelBoxOptions,
        gridArea: gridAreaToString(field.gridArea),
      }).append(ValidationBox(field, fieldFn(field), { width: pct(100) }));
    } else {
      throw `no form field creator for type ${field.type}`;
    }
    return field.view;
  }

  return restoreOptions(
    Grid(options).append(
      ...Object.entries(fields).map(([k, v]) => FormFieldView(k as keyof R, v as FormField<unknown>))
    )
  );
}
