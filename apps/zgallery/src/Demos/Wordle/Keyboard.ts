import { Button, ColorToken, HStack, VStack, zspace, StackOptions, atom, flexToken } from "zaffre";

//
// A basic QWERTY keyboard with delete and enter keys, laid out in three rows. There is a
// single action for all keys, along with a single function to determine the color of each key.
//

export interface KeyboardModel {
  keyDisabled(): boolean;
  keyAction(key: string): void;
  keyBackground(key: string): ColorToken;
}

export interface KeyboardOptions extends StackOptions {}

const keyboardButtonOptions = (key: string, model: KeyboardModel) => ({
  name: "keyboardButton",
  label: key,
  action: () => model.keyAction(key),
  disabled: () => model.keyDisabled(),
  background: () => model.keyBackground(key),
  flex: key.length === 1 ? flexToken({ grow: 1, shrink: 1 }) : undefined,
});

export const Keyboard = (model: KeyboardModel, options: KeyboardOptions = {}) => {

  const keys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Delete", "Z", "X", "C", "V", "B", "N", "M", "Enter"],
  ];

  return VStack(options).append(
    ...keys.map((_row, index) =>
      HStack({ gap: zspace.s3 }).append(...keys[index].map((key) => Button(keyboardButtonOptions(key, model))))
    )
  );
};
