import { atom, zget, zstring } from ":foundation";
import { View, ColorToken, css_background, css_color, AttributeEffect, BV, restoreOptions } from ":core";
import { EffectsBundle, dropShadowForElevation } from ":core";
import { core, defineComponentBundle, mergeComponentOptions } from ":core";
import { Button, ButtonOptions } from "./Button";

//
// A TextButton looks like plain text, but responds to a click and has button-like
// interaction effects. There are some functions here to create some text effects, but
// the default is to use normal button effects.
//
// This is often used in a SegmentedTextButton.
//

function attributeEffect(name: string, elevation: number, opacity: number): AttributeEffect {
  const attrs = {
    filter: dropShadowForElevation(elevation),
    opacity: opacity,
  };
  return new AttributeEffect(attrs, "in&out", { useOverlay: false });
}

export function defaultTextButtonInteractionEffects(): EffectsBundle {
  return {
    enabled: attributeEffect("enabled", 0, 0.0),
    disabled: attributeEffect("disabled", 0, 0.5),
    hovered: attributeEffect("hovered", 5, 0.2),
    focused: attributeEffect("focused", 1, 0.25),
    pressed: attributeEffect("pressed", 1, 0.3),
    clicked: attributeEffect("clicked", 1, 0.2),
  };
}

// TODO: textButtonInteractionEffects
export interface TextButtonOptions extends ButtonOptions {
  textColor?: css_color;
}
defineComponentBundle<TextButtonOptions>("TextButton", "Button", {
  background: core.color.transparent,
  textColor: core.color.primary,
  border: core.border.none,
  //effects: defaultTextButtonInteractionEffects(),
});

export function fgContrast(bg: css_background): css_color | undefined {
  const token = zget(bg);
  if (token instanceof ColorToken) {
    return bg instanceof ColorToken ? token.contrast : atom(() => token.contrast);
  } else {
    return undefined;
  }
}
export function TextButton(text: zstring, inOptions: BV<TextButtonOptions> = {}): View {
  const options = mergeComponentOptions("TextButton", inOptions);

  options.label = text;
  options.color ??= fgContrast(options.background);
  return restoreOptions(Button(options));
}
