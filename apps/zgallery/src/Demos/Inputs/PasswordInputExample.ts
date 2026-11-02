import { atom, PasswordInput } from "zaffre";
import { InputExampleBox } from "./InputExampleBox";

export const PasswordInputExample = () => {
  const password = atom("pass");
  const passwordValid = atom(() => password.get().length > 5);
  return InputExampleBox(
    password,
    passwordValid, 
    PasswordInput(password, {
      valid: passwordValid,
      maxLength: 6,
      required: true
    })
  );
}
