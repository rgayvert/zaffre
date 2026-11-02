import { Atom, nullish } from ":foundation";
import { addClass } from ":view";
import { GenericTextInput, TextInputOptions } from "./GenericTextInput";

//
// A collection of text input components based on GenericTextInput, where a simple
// reactive text value is used, and no additional parsing or formatting is provided.
// These include text, password, email, tel, and url.
//

// NOTE: see https://www.html5pattern.com/ for some useful patterns

const textIdentity = (s: string | nullish) => (s ? s : "");

export const SimpleTextInput = (textValue: Atom<string>, options: TextInputOptions = {}) => {
  return GenericTextInput(textValue, textIdentity, textIdentity, options);
};

export const TextInput = (value: Atom<string>, inOptions: TextInputOptions = {}) => {
  const options = addClass(inOptions, "TextInput");
  options.inputType = "text";
  return SimpleTextInput(value, options);
};

export const PasswordInput = (value: Atom<string>, inOptions: TextInputOptions = {}) => {
  const options = addClass(inOptions, "PasswordInput");
  options.inputType = "password";
  options.autocomplete = "current-password";
  return SimpleTextInput(value, options);
};

export const EmailInput = (value: Atom<string>, inOptions: TextInputOptions = {}) => {
  const options = addClass(inOptions, "EmailInput");
  options.inputType = "email";
  return SimpleTextInput(value, options);
};

export const TelephoneInput = (value: Atom<string>, inOptions: TextInputOptions = {}) => {
  const options = addClass(inOptions, "TelephoneInput");
  options.inputType = "tel";
  return SimpleTextInput(value, options);
};

export const URLInput = (value: Atom<string>, inOptions: TextInputOptions = {}) => {
  const options = addClass(inOptions, "URLInput");
  options.inputType = "url";
  return SimpleTextInput(value, options);
};
