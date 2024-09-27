import { atom, core, View, HStack, TextLabel } from "zaffre";
import { TelephoneInput, CSSBorderStyle } from "zaffre";
import { ValueBox } from "./ValueBox";

export function TelephoneInputExample(): View {
  const phone = atom("123-456-7890");
  const phoneValid = atom(false);

  return ValueBox(
    phone,
    phoneValid,
    HStack({ gap: core.space.s3 }).append(
      TelephoneInput(phone, {
        border: core.border.thin.color(core.color.blue),
        borderStyle: atom(() => (phoneValid.get() ? "solid" : "dashed") as CSSBorderStyle),
        font: core.font.title_medium,
        pattern: "[0-9]{3}-[0-9]{3}-[0-9]{4}",
        valid: phoneValid,
      }),
      TextLabel(
        atom(() => (phoneValid.get() ? "✓" : "✖")),
        {
          color: atom(() => (phoneValid.get() ? core.color.green : core.color.red)),
        }
      )
    )
  );
}
