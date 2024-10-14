import { Atom, BasicAction, RecordEditor, atom, updateRecordFromEditor } from ":foundation";
import { zget, zstring } from ":foundation";
import { View, core, em, pct, defineComponentBundle } from ":core";
import { mergeComponentOptions, BV, restoreOptions } from ":core";
import { HStack, VStack, GridOptions, } from "../Layout";
import { Button } from "../Controls";
import { FormField, FormFieldCreators, FormFieldSpec, FormFieldSpecs } from "./FormField";
import { DefaultFormFieldFns } from "./FormInputs";
import { FormGrid, FormGridOptions } from "./FormGrid";

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

export interface FormOptions extends GridOptions {
  fieldFns?: FormFieldCreators;
  cancelLabel?: zstring;
  resetLabel?: zstring;
  submitLabel?: zstring;
  cancelAction?: BasicAction;
  submitAction?: BasicAction;
  validationOn?: Atom<boolean>;
  formGridOptions?: FormGridOptions;
}
defineComponentBundle<FormOptions>("Form", "VStack", {
  fieldFns: DefaultFormFieldFns,
  cancelLabel: "Cancel",
  resetLabel: "Reset",
  submitLabel: "Submit",
  gap: em(2),
  width: pct(100),
});

export function Form<R>(
  record: Atom<R>,
  editor: RecordEditor<R>,
  fields: FormFieldSpecs<R>,
  inOptions: BV<FormOptions> = {}
): View {
  const options = mergeComponentOptions("Form", inOptions);
  options.model = [record, editor, fields];

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

  return restoreOptions(
    VStack(options).append(
      FormGrid(editor, fields, {
        ...options.formGridOptions,
        validationOn: options.validationOn,
      }),
      HStack({ gap: core.space.s3 }).append(
        ActionButton(options.resetLabel, () => reset()),
        ActionButton(options.cancelLabel, () => cancel()),
        ActionButton(options.submitLabel, () => submit())
      )
    )
  );
}
