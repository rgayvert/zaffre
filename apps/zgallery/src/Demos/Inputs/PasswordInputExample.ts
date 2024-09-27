import { atom, core, View, PasswordInput } from "zaffre";
import { ValueBox } from "./ValueBox";

export function PasswordInputExample(): View {
  const password = atom("pass");
  const passwordValid = atom(false);
  return ValueBox(
    password,
    passwordValid, 
    PasswordInput(password, {
      border: core.border.thin.color(core.color.blue),
      font: core.font.title_medium,
      valid: passwordValid,
      maxLength: 6,
      required: true
    })
  );
}
