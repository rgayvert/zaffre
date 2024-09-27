import { View, Dots } from "zaffre";

export function DotsExample(): View {
  const values = [true, true, true, false, false];

  return Dots(values, {});
}
