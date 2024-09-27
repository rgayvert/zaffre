import { FormFieldSpecs, defaultFormValidator } from ":components";
import { DemoUserRecord } from "./DemoUserRecord";

export function demoUserFields(): FormFieldSpecs<DemoUserRecord> {
  return {
    title: {
      label: "Title",
      type: "select",
      choices: ["", "Mr", "Mrs", "Miss", "Ms"],
      gridArea: { r1: 1, c1: 1, r2: 2, c2: 2 },
      validators: [defaultFormValidator.notBlank],
    },
    lastName: {
      label: "Last Name",
      type: "string",
      gridArea: { r1: 1, c1: 2, r2: 2, c2: 5 },
      validators: [defaultFormValidator.length(1, 20), defaultFormValidator.lettersOnly],
    },
    firstName: {
      label: "First Name",
      type: "string",
      gridArea: { r1: 1, c1: 5, r2: 2, c2: 8 },
      validators: [defaultFormValidator.notBlank],
    },
    email: {
      label: "Email",
      type: "email",
      gridArea: { r1: 2, c1: 1, r2: 3, c2: 5 },
      validators: [defaultFormValidator.email],
    },
    role: {
      label: "Role",
      type: "select",
      choices: ["", "Admin", "User"],
      gridArea: { r1: 2, c1: 5, r2: 3, c2: 8 },
      validators: [defaultFormValidator.notBlank],
    },
    password: {
      label: "Password",
      type: "password",
      gridArea: { r1: 3, c1: 1, r2: 4, c2: 4 },
      validators: [defaultFormValidator.length(6)],
    },
  };
}
