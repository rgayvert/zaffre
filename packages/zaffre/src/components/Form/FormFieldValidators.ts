import { AnyFormField, FormFieldValidator } from "./FormField";

//
// Default validators to use with a form. These can be 
//

export const defaultFormValidator = {
  notBlank: (field: AnyFormField): string => {
    const val = field.value.get();
    return val && val !== "&nbsp;" ? "" : "Must not be blank";
  },
  lettersOnly: (field: AnyFormField): string => {
    const val = field.value.get();
    if (typeof val === "string") {
      return val.match(/^[A-Za-z]+$/) ? "" : "Must be letters only";
    } else {
      return "";
    }
  },

  length: (min: number, max?: number): FormFieldValidator<unknown> => {
    return (field: AnyFormField) => {
      const val = field.value.get();
      if (typeof val === "string") {
        if (val.length < min) {
          return `Length must be at least ${min}`;
        } else {
          return max && val.length > max ? `Length must be at most ${max}` : "";
        }
      } else {
        return "";
      }
    };
  },

  email: (field: AnyFormField): string => {
    const val = field.value.get();
    if (typeof val === "string") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(val.toLowerCase()) ? "" : "Invalid email address";
    } else {
      return "";
    }
  },
};
