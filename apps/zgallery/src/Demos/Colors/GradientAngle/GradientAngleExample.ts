import { Box, HStack, Slider, atom, ch, colorToken, linearGradient, zborder, zspace } from "zaffre";

export const GradientAngleExample = () => {
  const angle = atom(45);

  const gradient = (angle: number) => {
    return linearGradient({
        angle: angle,
        startColor: colorToken({ rgba: "#ff0000cc" }),
        endColor: colorToken({ rgba: "#0000ffcc" }),
        stopColors: [colorToken({ rgba: "#00ff00cc" })],
      });
  }
  return HStack({ gap: zspace.s7 }).append(
    Box({
      height: ch(20),
      width: ch(20),
      border: zborder.thin,
      background: () => gradient(angle.get()),
    }),
    Slider(angle, { maxVal: 360 })
  );
}
