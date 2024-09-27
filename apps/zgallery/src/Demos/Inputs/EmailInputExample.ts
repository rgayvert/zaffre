import { atom, core, View, EmailInput } from "zaffre";
import { ValueBox } from "./ValueBox";

export function EmailInputExample(): View {
  const email = atom("joe@example.com");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const emailValid = atom(() => emailRegex.test(email.get().toLowerCase()));
  return ValueBox(
    email,
    emailValid,
    EmailInput(email, {
      border: core.border.thin,
      borderColor: atom(() => emailValid.get() ? undefined : core.color.red),
      font: core.font.title_medium,
    }),
    
  );
}
