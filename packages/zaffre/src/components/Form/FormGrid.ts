import { Atom, RecordEditor, TabularRecord, atom } from ":foundation";
import { gridAreaToString } from ":foundation";
import { View, em, pct, defineComponentBundle, mergeComponentOptions } from ":core";
import { BV, restoreOptions } from ":core";
import { Grid, GridOptions } from "../Layout";
import { LabelBox, LabelBoxOptions } from "../ControlGroups";
import { ValidationBox } from "./ValidationBox";
import { FormField, FormFieldCreators, formFieldIsValid, FormFields, FormFieldSpec, FormFieldSpecs } from "./FormField";
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
  onChange?: (field: FormField<unknown>, fields: FormFields<unknown>) => void;
}
defineComponentBundle<FormGridOptions>("FormGrid", "Grid", {
  fieldFns: DefaultFormFieldFns,
  gap: em(1),
  width: pct(100),
  labelBoxOptions: {
    placementPt: "xstart-ystart",
  },
});

function checkGridAreas<R>(fields: FormFieldSpecs<R>): void {
  // supply gridAreas if necessary
  const ga = { r1: 1, c1: 1, r2: 2, c2: 2 };
  Object.entries(fields).forEach(([key, f]) => {
    const field = f as FormFieldSpec<R>;
    if (!field.gridArea) {
      field.gridArea = { ...ga };
      ga.r1++;
      ga.r2++;
    }
  });
}

export function FormGrid<R extends TabularRecord>(
  record: R,
  fields: FormFieldSpecs<R>,
  inOptions: BV<FormGridOptions> = {}
): View {
  const options = mergeComponentOptions("FormGrid", inOptions);
  options.model = [record, fields];
  checkGridAreas(fields);
  const editor = <RecordEditor<R>>record.editor;

  function FormFieldView(property: keyof R, field: FormField<unknown>): View | undefined {
    const fieldFn = options.fieldFns!.get(field.type);
    field.value = editor[property];
    field.isValid = atom(() => formFieldIsValid(field));
    field.validationOn = options.validationOn;
    if (options.onChange) {
      field.value.addAction(() => options.onChange?.(field, fields));
    }
    if (fieldFn) {
      field.view = LabelBox(field.label, {
        ...options.labelBoxOptions,
        gridArea: gridAreaToString(field.gridArea!),
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
