import { Atom, atom, BasicAction } from ":foundation";
import { ValidationResult, ValidationSchema, validationSuccess } from ":foundation";
import { addOptionEvents, View } from ":view";
import { zcolor } from ":theme";
import { TextInputOptions } from "../Inputs";
import { FormField } from "./FormField";
import { TextLabel } from "../Content";
import { LabelBox } from "../ControlGroups";
import { ValidationBox } from "./ValidationBox";

export interface FormModelOptions {
  schema?: ValidationSchema<any>;
  embedLabels?: boolean;
  stackFields?: boolean;
  readOnly?: Atom<boolean>;
}
export class FormModel<R extends {}> {
  validationOn = atom(false);
  submitDisabled = atom(true);
  resetDisabled = atom(true);
  onFieldChanged?: (field: FormField) => void;
  focusField = atom<FormField | undefined>(undefined);
  submitAction?: BasicAction;
  extraConstraint?: (values: R) => boolean;

  constructor(
    public record: Atom<R>,
    public fields: FormField[],
    public options: FormModelOptions = {},
  ) {
    this.fields.forEach((field) => this.initField(field));
    if (options.stackFields) {
      this.addVerticalGridAreas();
    }
  }

  submitIfReady(): void {
    if (!this.submitDisabled.get()) {
      this.submitAction?.();
    }
  }

  fieldWithLabel(label: string): FormField | undefined {
    return this.fields.find((f) => f.getLabel() === label);
  }
  fieldNamed(name: string): FormField | undefined {
    return this.fields.find((f) => f.name === name);
  }

  initField(field: FormField): void {
    if (field.value instanceof Atom) {
      field.value.addAction(() => this.fieldChanged(field));
    }
    field.updateDefault();
  }

  addVerticalGridAreas(): void {
    this.fields.forEach((field, r) => {
      field.setGridArea(r + 1, 1, r + 2, 2);
    });
  }

  isModified(): boolean {
    return !!this.fields.find((f) => f.isChanged());
  }

  fieldChanged<T>(field: FormField) {
    field.validationMessage?.set(this.getFieldMessage(field));
    this.onFieldChanged?.(field);
    const modified = this.isModified();
    this.resetDisabled.set(!modified);
    this.submitDisabled.set(!modified || !this.allFieldsAreValid());
  }

  values(): R {
    return { ...this.record.get() };
  }

  // TODO: parsing may try to update the record, so values() needs to be a simple record,
  // not a proxy
  validate(): ValidationResult<any> {
    if (this.options.schema) {
      return this.options.schema.safeParse(this.values());
    } else {
      return validationSuccess;
    }
  }
  getFieldMessage<T>(field: FormField): string {
    if (!this.validationOn.get()) {
      //return "";                    // TODO: fix when validation happens
    }
    const result = this.validate();
    if (result.success) {
      return "";
    } else {
      const issue = result.error.issues.find((issue) => issue.path === field.value.key);
      return issue ? issue.message : "";
      //return "problem";
    }
  }
  allFieldsAreValid(): boolean {
    const valid = this.options.schema
      ? this.validate().success
      : Object.values(this.fields).every((field) => field.isValid.get());

    return this.extraConstraint ? this.extraConstraint(this.values()) && valid : valid;
  }
  readyToSubmit(): boolean {
    return this.allFieldsAreValid();
  }

  reset(): void {
    this.validationOn.set(false);
    this.fields.forEach((field) => field.reset());
    this.resetDisabled.set(true);
    this.submitDisabled.set(true);
  }

  updateDefaults(): void {
    this.fields.forEach((field) => field.updateDefault());
    this.resetDisabled.set(true);
    this.submitDisabled.set(true);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////

  inputOptions<T>(field: FormField): TextInputOptions {
    return {
      borderColor: () => (field.isValid!.get() ? undefined : zcolor.error),
      //autofocus: field.getFirstFocus(),
    };
  }

  createView(field: FormField): View {
    const v = field.createView();
    v.options.takeFocusWhen = atom(() => this.focusField.get() === field);
    addOptionEvents(v.options, {
      focus: () => this.focusField.set(field),
    });
    return v;
  }

  fieldViews<T>(field: FormField): View[] {
    const gridArea = { gridArea: field.gridArea };

    if (this.options.embedLabels) {
      return [
        LabelBox(field.getLabel(), { ...gridArea, side: "left" }).append(
          ValidationBox(field, this.createView(field), this.options.readOnly),
        ),
      ];
    } else if (field.value instanceof Atom && field.getLabel()) {
      return [
        TextLabel(field.getLabel(), { cls: "Form_ColumnLabel" }),
        ValidationBox(field, this.createView(field), this.options.readOnly, gridArea),
      ];
    } else if (field.value instanceof Atom) {
      return [ValidationBox(field, this.createView(field), this.options.readOnly, gridArea)];
    } else {
      return [this.createView(field)];
    }
  }

  nextFocusFieldAfter(f: FormField): FormField {
    const idx = this.fields.indexOf(f);
    const n = this.fields.length;
    for (let j = 1; j < n; j++) {
      const ff = this.fields[(idx + j) % n];
      if (ff.value instanceof Atom) {
        return ff;
      }
    }
    return f;
  }
  moveFocusForward(): void {
    const f = this.focusField.get();
    if (f) {
      this.focusField.set(this.nextFocusFieldAfter(f));
    }
  }

  get allViews(): View[] {
    return this.fields.map((field) => this.fieldViews(field)).flat();
  }
}
