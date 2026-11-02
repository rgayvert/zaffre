import { Audio, pct, em } from "zaffre";

export const AudioExample = () => {
  return Audio("audio.t-rex", { width: pct(50), height: em(2) });
}
