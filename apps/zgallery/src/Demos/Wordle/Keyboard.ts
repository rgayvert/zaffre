import { core, Button, ColorToken, HStack, TAction, VStack, View, ViewOptions } from "zaffre";
import { atom, standardHTMLInteractionEffects, em, vmin, flexToken } from "zaffre";

//
// A basic QWERTY keyboard with delete and enter keys, laid out in three rows. There is a
// single action for all keys, along with a single function to determine the color of each key.
//

export interface KeyboardOptions extends ViewOptions {
  action?: TAction<string>;
  keyBackground?: (key: string) => ColorToken;
}
export function Keyboard(options: KeyboardOptions = {}): View {
  const keys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Delete", "Z", "X", "C", "V", "B", "N", "M", "Enter"],
  ];
  function KeyboardButton(key: string): View {
    return Button({
      label: key,
      action: () => options.action?.(key),
      disabled: options.disabled,
      borderRadius: vmin(1),
      border: core.border.thin,
      color: core.color.black,
      background: atom(() => (options.keyBackground ? options.keyBackground(key) : core.color.secondary.contrast)),
      flex: key.length === 1 ? flexToken({ grow: 1, shrink: 1 }) : undefined,
      minWidth: em(1.5),
      effects: standardHTMLInteractionEffects(),
      name: key,
    });
  }
  return VStack({ gap: core.space.s3 }).append(
    ...keys.map((_row, index) => HStack({ gap: core.space.s3 }).append(...keys[index].map((key) => KeyboardButton(key))))
  );
}
