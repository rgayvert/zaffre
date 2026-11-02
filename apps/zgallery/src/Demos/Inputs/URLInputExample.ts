import { atom, URLInput } from "zaffre";
import { InputExampleBox } from "./InputExampleBox";

export const URLInputExample = () => {
  const url = atom("http://example.com");
  const urlValid = atom(false);
  return InputExampleBox(url, 
    urlValid, 
    URLInput(url, {
      valid: urlValid,
    })
  );
}
