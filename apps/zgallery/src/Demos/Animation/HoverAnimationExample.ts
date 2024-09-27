import { AttributeEffect, Box, CenteredTextLabel, View, core, colorToken, pct, px } from "zaffre";
import { HoverAnimationModel } from "./HoverAnimationModel";

// Create one face of a cube
function Face(text: string, hexColor: string, transform: string): View {
  return CenteredTextLabel(text, {
    backfaceVisibility: "inherit",
    background: colorToken({ rgba: hexColor }),
    color: core.color.white,
    font: core.font.display_medium,
    width: pct(100),
    height: pct(100), 
    position: "absolute",
    transform: transform,
  });
}

// TODO: attribute effects should be styles so that changing interaction state is smoother.
// When this hover effect is canceled it's jerky because the out animation starts at the end
// rather than where it was last.
// QUESTION: Can an "out" animation know where to start?

export function HoverAnimationExample(): View {
  const model = new HoverAnimationModel();
  return  Box({
    margin: core.space.s6,
      background: core.color.none,
      width: px(100),
      height: px(100), 
      transformStyle: "preserve-3d",
      transform: "rotate3d(1, 1, 1, 30deg)",
      transition: "transform 2.5s",
      effects: {
        hovered: new AttributeEffect({ transform: "rotate3d(1, 1, 1, 330deg)"}, "in&out"),
      },
    }).append(...model.faces.map(([color, transform], index) => Face(`${index + 1}`, color, transform)));
}