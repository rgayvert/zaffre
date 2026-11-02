import {
  atom,
  Atom,
  AtomOrValue,
  BasicAction,
  Builder,
  DateTimeFormatter,
  gridAreaToString,
  IBuilder,
  PickList,
  zboolean,
  zget,
  zstring,
} from ":foundation";
import { OptionRules, View, ViewCreator, ViewOptions } from ":view";
import { css_width } from ":attributes";
import { DropDownButton, MenuItemList } from "../Floating";
import { SegmentedButton } from "../ControlGroups";
import { ImageBox, TextLabel, TextArea, TextBox } from "../Content";
import { Switch } from "../Controls";
import {
  EmailInput,
  FileInput,
  ImageInput,
  NumberInput,
  NumericInput,
  PasswordInput,
  TelephoneInput,
  TextInput,
  URLInput,
} from "../Inputs";
import { ComboBox, DateInput, DateTimeInput } from "../Composite";

interface IViewSpec<T> {
  name: string;
  value: AtomOrValue<T | null>;
  style?: string;
  cls?: string;
  creator: ViewCreator;
  action?: BasicAction;
  displayValue?: () => string;
  disabled?: Atom<boolean>;
  firstFocus?: zboolean;
  gridArea?: zstring;
  min?: number;
  newAction?: (pickList: PickList<any>) => void;
  label?: zstring;
  menuItemList?: MenuItemList<T>;
  pickList?: PickList<T>;
  placeholder?: string;
  rules?: OptionRules;
  size?: number;
  tooltip?: zstring;
  viewOptions?: ViewOptions;
  width?: css_width;
  accept?: zstring; // image types
  onLoad?: (file: File, url: Atom<string>) => void;
}
interface ViewSpec<T> extends IViewSpec<T> {}

class ViewSpec<T> implements IViewSpec<T> {
  validationMessage = atom("");
  isValid = atom(() => !Boolean(this.validationMessage.get()));

  constructor() {}

  setGridArea(r1: number, c1: number, r2: number, c2: number): ViewSpec<T> {
    this.gridArea = gridAreaToString({ r1, c1, r2, c2 });
    return this;
  }
  createView(): View {
    return this.creator(this);
  }
  updateDefault(): void {
    if (this.value instanceof Atom) {
      this.value.updateDefault();
    }
  }
  isChanged(): boolean {
    return this.value instanceof Atom ? !this.value.matchesDefault() : false;
  }
  reset(): void {
    if (this.value instanceof Atom) {
      this.value.resetToDefaultValue();
    }
  }
  getLabel(): string {
    return zget(this.label) || "";
  }
  getDisplayValue(): string {
    return this.displayValue?.() || (this.value ? (zget(this.value) || "").toString() : "");
  }
}

type ViewSpecBuilder<T> = IBuilder<ViewSpec<T>>;

export type FormField = ViewSpec<any>;
export type FormFieldSpec = ViewSpecBuilder<any>;

const valueField = <T>(name: string, value: AtomOrValue<T | null>, creator: ViewCreator): ViewSpecBuilder<T> => {
  value instanceof Atom && value.updateDefault();
  return Builder(ViewSpec<T>)
    .name(name)
    .value(value)
    .creator(creator);
};

export const comboBoxSpec = <T>(
  name: string,
  value: Atom<string>,
  menuItemList: MenuItemList<string>,
): ViewSpecBuilder<string> => {
  menuItemList.lastSelection.addAction((mi) => mi && value.set(mi.value || ""));
  return valueField(name, value, (options) => ComboBox(value, menuItemList, { ...options, disabledOpacity: 1.0 }));
};
export const dropDownButtonSpec = <T>(
  name: string,
  value: Atom<T | null>,
  menuItemList: MenuItemList<T>,
): ViewSpecBuilder<T> => {
  menuItemList.lastSelection.addAction((mi) => mi && value.set(mi.value || null));
  return valueField(name, value, (options) => DropDownButton(menuItemList, { ...options, disabledOpacity: 1.0 }))
    .displayValue(() => menuItemList.selectedLabel())
    .menuItemList(menuItemList);
};
export const segmentedButtonSpec = <T>(name: string, value: Atom<T>, pickList: PickList<T>): ViewSpecBuilder<T> => {
  pickList.lastSelection.addAction((v) => v && value.set(v));
  return valueField(name, value, (options) => SegmentedButton(pickList, options)).pickList(pickList);
};

export const imageBoxSpec = (name: string, value: AtomOrValue<string>): ViewSpecBuilder<string> => {
  return valueField(name, value, (options) => ImageBox(value, options));
};
export const textBoxSpec = (name: string, value: AtomOrValue<string>): ViewSpecBuilder<string> => {
  return valueField(name, value, (options) => TextBox(value, options));
};
export const switchButtonSpec = (name: string, value: Atom<boolean>): ViewSpecBuilder<boolean> => {
  return valueField(name, value, (options) => Switch(value, options));
};

export const textInputSpec = (name: string, value: Atom<string>): ViewSpecBuilder<string> => {
  return valueField(name, value, (options) => TextInput(value, options));
};
export const passwordInputSpec = (name: string, value: Atom<string>): ViewSpecBuilder<string> => {
  return valueField(name, value, (options) => PasswordInput(value, options));
};
export const emailInputSpec = (name: string, value: Atom<string>): ViewSpecBuilder<string> => {
  return valueField(name, value, (options) => EmailInput(value, options));
};
export const telephoneInputSpec = (name: string, value: Atom<string>): ViewSpecBuilder<string> => {
  return valueField(name, value, (options) => TelephoneInput(value, options));
};
export const urlInputSpec = (name: string, value: Atom<string>): ViewSpecBuilder<string> => {
  return valueField(name, value, (options) => URLInput(value, options));
};
export const fileInputSpec = (name: string, value: Atom<File[]>): ViewSpecBuilder<File[]> => {
  return valueField(name, value, (options) => FileInput(value, options));
};
export const imageInputSpec = (name: string, value: Atom<string>): ViewSpecBuilder<string> => {
  return valueField(name, value, (options) => ImageInput(value, options));
};

export const dateInputSpec = (name: string, value: Atom<Date>): ViewSpecBuilder<Date> => {
  return valueField(name, value, (options) => DateInput(value, options)).displayValue(() =>
    DateTimeFormatter("YYYY-MM-DD")(value.get()),
  );
};

export const dateTimeInputSpec = (name: string, value: Atom<Date>): ViewSpecBuilder<Date> => {
  return valueField(name, value, (options) => DateTimeInput(value, options));
};

export const labelSpec = (name: string, value: AtomOrValue<string>): ViewSpecBuilder<string> => {
  return valueField(name, value, (options) => TextLabel(value, options));
};

export const textAreaSpec = (name: string, value: Atom<string>): ViewSpecBuilder<string> => {
  return valueField(name, value, (options) => TextArea(value, options));
};

export const numberInputSpec = (name: string, value: Atom<number>, decimalPlaces?: number): ViewSpecBuilder<number> => {
  return valueField(name, value, (options) => NumberInput(value, { ...options, decimalPlaces, selectOnFocus: true }));
};

export const numericInputSpec = (name: string, value: Atom<number>): ViewSpecBuilder<number> => {
  return valueField(name, value, (options) => NumericInput(value, { ...options, selectOnFocus: true }));
};
