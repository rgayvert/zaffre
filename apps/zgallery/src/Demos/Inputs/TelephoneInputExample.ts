import { atom, HStack, TextLabel, zcolor } from "zaffre";
import { TelephoneInput, CSSBorderStyle } from "zaffre";
import { InputExampleBox } from "./InputExampleBox";

export const TelephoneInputExample = () => {
  const phone = atom("123-456-7890");
  const phoneValid = atom(false);

  return InputExampleBox(
    phone,
    phoneValid,
    HStack({ cls: "input-container" }).append(
      TelephoneInput(phone, {
        borderStyle: () => phoneValid.get() ? "solid" : "dashed",
        pattern: "[0-9]{3}-[0-9]{3}-[0-9]{4}",
        valid: phoneValid,
        maxLength: 12,
        size: 12
      }),
      TextLabel(
        () => phoneValid.get() ? "✓" : "✖",
        {
          color: () => phoneValid.get() ? zcolor.green : zcolor.red,
        }
      )
    )
  );
}
