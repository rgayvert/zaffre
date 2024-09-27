import { Box, GradientToken, HStack, Slider, View, atom, ch, core, colorToken, css, linearGradient } from "zaffre";

export function GradientAngleExample(): View {
  const angle = atom(45);

  function gradient(angle: number): GradientToken {
    return linearGradient({
        angle: angle,
        startColor: colorToken({ rgba: "#ff0000cc" }),
        endColor: colorToken({ rgba: "#0000ffcc" }),
        stopColors: [colorToken({ rgba: "#00ff00cc" })],
      });
  }
  return HStack({ gap: core.space.s7 }).append(
    Box({
      height: ch(20),
      width: ch(20),
      border: core.border.thin,
      background: atom(() => gradient(angle.get())),
    }),
    Slider(angle, { maxVal: 360 })
  );
}
