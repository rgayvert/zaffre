import { Atom, BasicAction, RecordEditor, atom, updateRecordFromEditor } from ":foundation";
import { zget, zstring, gridAreaToString } from ":foundation";
import { View, core, em, pct, defineBaseOptions, mergeComponentOptions, BV } from ":core";
import { Grid, HStack, VStack, GridOptions, StackOptions } from "../Layout";
import { LabelBox, LabelBoxOptions } from "../ControlGroups";
import { Button } from "../Controls";
import { Spacer } from "../Layout";
import { ValidationBox } from "./ValidationBox";
import { FormField, FormFieldCreators, formFieldIsValid, FormFieldSpec, FormFieldSpecs } from "./FormField";
import { DefaultFormFieldFns } from "./FormInputs";

//
// A Form contains a collection of input fields wrapped in validation boxes that are placed into a grid.
// The idea is to do this declaratively. Each field is defined by a FormFieldSpec, which provides:
//   - type and label, choices (if applicable)
//   - gridArea in which field is placed
//   - validators to apply
//
// The form is responsible for:
//   - style of fields (e.g., label position)
//   - mapping of field type to input component (e.g., type of input to use for a boolean type)
//   - handling cancel/reset/submit
//
// There are default sets of validators and input mappings, but these can be extended or replaced.
//

const labelOptions: LabelBoxOptions = {
  placementPt: "xstart-ystart",
  labelOptions: {
    font: core.font.label_medium,
  },
};

export interface FormOptions extends GridOptions {
  fieldFns?: FormFieldCreators;
  cancelLabel?: zstring;
  resetLabel?: zstring;
  submitLabel?: zstring;
  cancelAction?: BasicAction;
  submitAction?: BasicAction;
  validationOn?: Atom<boolean>;
  containerOptions?: StackOptions;
}
defineBaseOptions<FormOptions>("Form", "Grid", {
  fieldFns: DefaultFormFieldFns,
  cancelLabel: "Cancel",
  resetLabel: "Reset",
  submitLabel: "Submit",
  gap: em(1),
  width: pct(100),
  containerOptions: {
    gap: core.space.s4,
  },
});

export function Form<R>(
  record: Atom<R>,
  editor: RecordEditor<R>,
  fields: FormFieldSpecs<R>,
  inOptions: BV<FormOptions> = {}
): View {
  const options = mergeComponentOptions("Form", inOptions);

  function FormFieldView(property: keyof R, field: FormField<unknown>): View | undefined {
    const fieldFn = options.fieldFns!.get(field.type);
    field.value = editor[property];
    field.isValid = atom(() => formFieldIsValid(field));
    field.validationOn = options.validationOn;
    if (fieldFn) {
      field.view = LabelBox(field.label, {
        ...labelOptions,
        gridArea: gridAreaToString(field.gridArea),
      }).append(ValidationBox(field, fieldFn(field), { width: pct(100) }));
    } else {
      throw `no form field creator for type ${field.type}`;
    }
    return field.view;
  }

  function reset(): void {
    Object.values(fields).forEach((field) => (<FormField<unknown>>field).value?.resetToInitialValue());
    options.validationOn?.set(false);
  }
  function cancel(): void {
    reset();
    options.cancelAction?.();
  }
  function allFieldsAreValid(): boolean {
    return Object.values(fields).every((field) => (<FormFieldSpec<R>>field).isValid?.get());
  }
  function submit(): void {
    options.validationOn?.set(true);
    if (allFieldsAreValid()) {
      updateRecordFromEditor(editor, record.get());
      options.submitAction?.();
    }
  }

  function ActionButton(label?: zstring, action?: BasicAction, disabled?: Atom<boolean>): View {
    return Button({
      label: label,
      controlSize: "sm",
      rounding: core.rounding.pill,
      action: action,
      hidden: atom(() => !zget(label)),
      disabled: disabled,
    });
  }

  return VStack(options.containerOptions).append(
    Grid(options).append(
      ...Object.entries(fields).map(([k, v]) => FormFieldView(k as keyof R, v as FormField<unknown>))
    ),
    Spacer(core.space.s5),
    HStack({ gap: core.space.s3 }).append(
      ActionButton(options.resetLabel, () => reset()),
      ActionButton(options.cancelLabel, () => cancel()),
      ActionButton(options.submitLabel, () => submit())
    )
  );
}
