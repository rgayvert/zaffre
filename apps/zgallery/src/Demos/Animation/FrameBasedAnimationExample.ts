import { View, Box, core, HStack, Button, atom, px, css_color } from "zaffre";
import { SimpleAnimationItem, css_rounding } from "zaffre";
import { FrameBasedAnimationModel } from "./FrameBasedAnimationModel";

export function FrameBasedAnimationExample(): View {
  const model = new FrameBasedAnimationModel();
  function ThingComponent(thing: SimpleAnimationItem, color: css_color, rounding: css_rounding): View {
    return Box({
      position: "absolute",
      width: px(20),
      height: px(20),
      rounding: rounding,
      background: color,
      transform: atom(() => `translate(${thing.location.get().x}px, ${thing.location.get().y}px)`),
    });
  }
  return HStack({ gap: core.space.s8 }).append(
    Box({ width: px(200), height: px(20), border: core.border.none }).append(
      ThingComponent(model.thing1, core.color.primary, core.rounding.r0),
      ThingComponent(model.thing2, core.color.red, core.rounding.circle)
    ),
    Button({
      label: "start",
      action: () => model.start(),
      disabled: atom(() => model.isRunning),
    })
  );
}
