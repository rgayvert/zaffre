import { atom, core, View, URLInput } from "zaffre";
import { ValueBox } from "./ValueBox";

export function URLInputExample(): View {
  const url = atom("http://example.com");
  const urlValid = atom(false);
  return ValueBox(url, 
    urlValid, 
    URLInput(url, {
      border: core.border.thin.color(core.color.blue),
      font: core.font.title_medium,
      valid: urlValid,
    })
  );
}
