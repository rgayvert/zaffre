import { Atom } from ":foundation";
import { View } from ":core";
import { InputType } from "../Content";
import { GenericTextInput, TextInputOptions } from "./GenericTextInput";

//
// A collection of text input components based on GenericTextInput, where a simple
// reactive text value is used, and no additional parsing or formatting is provided.
// These include text, password, email, tel, and url.
//

// NOTE: see https://www.html5pattern.com/ for some useful patterns


function textIdentity(s: string): string {
  return s;
}

export function SimpleTextInput(value: Atom<string>, inputType: InputType, inOptions: TextInputOptions = {}): View {
  return GenericTextInput(value, inputType, textIdentity, textIdentity, inOptions);
}

export function TextInput(text: Atom<string>, options: TextInputOptions = {}): View {
  return SimpleTextInput(text, "text", options);
}

export function PasswordInput(text: Atom<string>, options: TextInputOptions = {}): View {
  return SimpleTextInput(text, "password", options);
}

export function EmailInput(text: Atom<string>, options: TextInputOptions = {}): View {
  return SimpleTextInput(text, "email", options);
}

export function TelephoneInput(text: Atom<string>, options: TextInputOptions = {}): View {
  return SimpleTextInput(text, "tel", options);
}

export function URLInput(text: Atom<string>, options: TextInputOptions = {}): View {
  return SimpleTextInput(text, "url", options);
}

