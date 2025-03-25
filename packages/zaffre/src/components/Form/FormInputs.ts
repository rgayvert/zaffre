import { atom } from ":foundation";
import { calc, core, em, pct } from ":core";
import { TextArea, TextAreaOptions } from "../Content";
import { DateInput, EmailInput, NumberInput, PasswordInput, TextInput } from "../Inputs";
import { ChronoInputOptions, TextInputOptions } from "../Inputs";
import { FormField, FormFieldCreator } from "./FormField";
import { DropDownButton, SimpleDropDownButton } from "../Floating";
import { Switch } from "../Controls";
import { URLInputBox } from "../Composite";

//
// Default field creators. These will be ref//erenced when defining the set of
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
  fluidHeight: true, 
  rows: 3,
  font: core.font.body_medium, 
  resize: "none" 
};
const dateInputOptions: ChronoInputOptions = {
  border: core.border.thin,
};
const booleanInputOptions: ChronoInputOptions = {
  controlSize: "xs",
};

const defaultStringFieldFn = (field: FormField<string>) =>
  TextInput(field.value, {
    borderColor: atom(() => (field.isValid.get() ? undefined : core.color.red)),
    firstFocus: field.firstFocus,
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

  const defaultURLFieldFn = (field: FormField<string>) =>
    URLInputBox(field.value, {
      width: pct(100),
      action: () => field.openAction?.(field.value.get()),
      textInputOptions: {
        ...textInputOptions,
        width: calc("100% - 2ch"),
        borderColor: atom(() => (field.isValid.get() ? undefined : core.color.red)),
      }
    });

const defaultPasswordFieldFn = (field: FormField<string>) =>
  PasswordInput(field.value, {
    borderColor: atom(() => (field.isValid.get() ? undefined : core.color.red)),
    ...textInputOptions,
  });

const defaultDateFieldFn = (field: FormField<Date>) =>
  DateInput(field.value, {
    borderColor: atom(() => (field.isValid.get() ? undefined : core.color.red)),
    ...dateInputOptions,
  });

const defaultBooleanFieldFn = (field: FormField<boolean>) =>
  Switch(field.value, {
    borderColor: atom(() => (field.isValid.get() ? undefined : core.color.red)),
    ...booleanInputOptions,
  });

const defaultSelectFieldFn = (field: FormField<string>) =>
  SimpleDropDownButton(field.value, field.choices || [], {
    borderColor: atom(() => (field.isValid.get() ? undefined : core.color.red)),
    padding: core.space.s2,
    ...textInputOptions,
    minHeight: em(1),
  });

const defaultObjectListFieldFn = (field: FormField<Object>) =>
  DropDownButton(field.value, field.objects || [], field.objectTitleFn!, undefined, {
    borderColor: atom(() => (field.isValid.get() ? undefined : core.color.red)),
    padding: core.space.s2,
    ...textInputOptions,
    minHeight: em(1),
  });

export const DefaultFormFieldFns: Map<string, FormFieldCreator<unknown>> = new Map([
  ["string", defaultStringFieldFn as any],
  ["text", defaultTextFieldFn],
  ["number", defaultNumberFieldFn],
  ["email", defaultEmailFieldFn],
  ["password", defaultPasswordFieldFn],
  ["date", defaultDateFieldFn],
  ["select", defaultSelectFieldFn],
  ["object", defaultObjectListFieldFn],
  ["boolean", defaultBooleanFieldFn],
  ["url", defaultURLFieldFn],
]);
