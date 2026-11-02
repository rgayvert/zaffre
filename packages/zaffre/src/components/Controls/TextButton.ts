import { zget, zstring } from ":foundation";
import { ColorToken, css_background, css_color, addClass, afterOptionsMerged } from ":core";
import { EffectsBundle } from ":core";
import { Button, ButtonOptions } from "./Button";

//
// A TextButton looks like plain text, but responds to a click and has button-like
// interaction effects. There are some functions here to create some text effects, but
// the default is to use normal button effects.
//
// This is often used in a SegmentedTextButton.
//

export interface TextButtonOptions extends ButtonOptions {
  textColor?: css_color;
  effects?: EffectsBundle;
}

 
export const TextButton = (text: zstring, inOptions: TextButtonOptions = {}) => {
  const options = addClass(inOptions, "TextButton");
  options.model = text;
  options.label = text;

  afterOptionsMerged(options, () => {

    const fgContrast = (bg: css_background): css_color | undefined => {
      const token = zget(bg);
      if (token instanceof ColorToken) {
        return bg instanceof ColorToken ? token.contrast : () => token.contrast;
      } else {
        return undefined;
      }
    };

    options.color ??= fgContrast(options.background);
  });

  return Button(options);
};
