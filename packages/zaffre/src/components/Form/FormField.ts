import { Atom, GridArea, ZType } from ":foundation";
import { View } from ":core";

//
// A FormField defines the behavior of one field in a Form. It provides:
//   - type and label, choices (if applicable)
//   - gridArea in which field is placed
//   - validators to apply
//
// TODO: should we apply the Any pattern to other similar cases, or is this a bad idea?
//


export type FormFieldCreator<T> = (field: FormField<T>) => View;
export type FormFieldCreators = Map<string, FormFieldCreator<unknown>>;
export type AnyFormField = FormField<unknown>;
export type FormFieldValidator<T> = (field: FormField<T>) => string;

export type FormFieldSpec<T> = {
  type: string;
  label: string;
  firstFocus?: boolean;
  gridArea?: GridArea;
  view?: View;
  value?: Atom<T>;
  isValid?: Atom<boolean>;
  initialValue?: T;
  validators?: FormFieldValidator<T>[];
  validationOn?: Atom<boolean>;
  openAction?: (s: string) => void;
  choices?: string[];
  objects?: ZType<Iterable<T>>;
  objectTitleFn?: (t: T) => string;
};
export type FormFieldSpecs<R> = Omit<Partial<{
  [P in keyof R]: FormFieldSpec<unknown>;
}>, "recordID">;

export type FormFieldSpecFn<R> = (record: R) => FormFieldSpecs<R>;

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type FormField<T> = WithRequired<FormFieldSpec<T>, "view" | "value" | "isValid">;

export type FormFields<R> = Partial<{
  [P in keyof R]: FormField<unknown>;
}>;

export function formFieldValidationMessage<T>(field: FormField<T>): string {
    if (field.validationOn?.get()) {
      return field.validators?.map((validator) => validator(field)).find((s) => s) || "";
    } else {
      return "";
    }
}
export function formFieldIsValid<T>(field: FormField<T>): boolean {
  return !Boolean(formFieldValidationMessage(field));
}
