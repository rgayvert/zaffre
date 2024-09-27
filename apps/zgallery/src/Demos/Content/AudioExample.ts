import { View, Audio, pct, em } from "zaffre";

export function AudioExample(): View {
  return Audio("audio.t-rex", { width: pct(50), height: em(2) });
}
