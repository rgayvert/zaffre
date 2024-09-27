import { atom } from ":foundation";
import { core, em, pct } from ":core";
import { TextArea, TextAreaOptions } from "../Content";
import { EmailInput, NumberInput, PasswordInput, TextInput, TextInputOptions } from "../Inputs";
import { FormField, FormFieldCreator } from "./FormField";
import { DropDownButton } from "../Floating";

//
// Default field creators. These will be referenced when defining the set of
// form fields in a form.
//

const textInputOptions: TextInputOptions = {
  border: core.border.thin,
  rounding: core.rounding.r1,
  width: pct(100),
  padding: core.space.s2,
  name: "FormTextInput",
};
const textAreaOptions: TextAreaOptions = {
  border: core.border.thin,
  width: pct(100),
  padding: core.space.s2,
};

const defaultStringFieldFn = (field: FormField<string>) =>
  TextInput(field.value, {
    borderColor: atom(() => (field.isValid.get() ? undefined : core.color.red)),
    ...textInputOptions,
  });

const defaultTextFieldFn = (field: FormField<string>) =>
  TextArea(field.value, {
    borderColor: atom(() => (field.isValid.get() ? undefined : core.color.red)),
    ...textAreaOptions,
  });

const defaultNumberFieldFn = (field: FormField<number>) =>
  NumberInput(field.value, {
    borderColor: atom(() => (field.isValid.get() ? undefined : core.color.red)),
    ...textInputOptions,
  });

const defaultEmailFieldFn = (field: FormField<string>) =>
  EmailInput(field.value, {
    borderColor: atom(() => (field.isValid.get() ? undefined : core.color.red)),
    ...textInputOptions,
  });

const defaultPasswordFieldFn = (field: FormField<string>) =>
  PasswordInput(field.value, {
    borderColor: atom(() => (field.isValid.get() ? undefined : core.color.red)),
    ...textInputOptions,
  });

const defaultSelectFieldFn = (field: FormField<string>) =>
  DropDownButton(field.value, field.choices || [], {
    borderColor: atom(() => (field.isValid.get() ? undefined : core.color.red)),
    ...textInputOptions,
    minHeight: em(1),
  });

export const DefaultFormFieldFns: Map<string, FormFieldCreator<unknown>> = new Map([
  ["string", defaultStringFieldFn as any],
  ["text", defaultTextFieldFn],
  ["number", defaultNumberFieldFn],
  ["email", defaultEmailFieldFn],
  ["password", defaultPasswordFieldFn],
  ["select", defaultSelectFieldFn],
]);
