import { View, core, Box, BoxOptions, atom, zutil, windowWidth, ch } from "zaffre";

export function ReactiveOptionsExample(): View {
  const options: BoxOptions = {
    width: ch(10),
    height: ch(10),
    border: core.border.thin,
    background: core.color.primary,
    opacity: atom(() => zutil.clamp((windowWidth() - 500) / 2000, 0, 1)),
  };
  return Box(options);
}
 