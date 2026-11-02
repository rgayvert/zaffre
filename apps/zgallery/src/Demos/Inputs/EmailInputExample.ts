import { atom, EmailInput, zcolor } from "zaffre";
import { InputExampleBox } from "./InputExampleBox";

export const EmailInputExample = () => {
  const email = atom("joe@example.com");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const emailValid = atom(() => emailRegex.test(email.get().toLowerCase()));
  return InputExampleBox(
    email,
    emailValid,
    EmailInput(email, {
      borderColor: () => emailValid.get() ? undefined : zcolor.red,
    }),
    
  );
}
