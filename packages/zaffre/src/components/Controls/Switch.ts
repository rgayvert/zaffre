import { atom, zget, ToggleAtom, Atom } from ":foundation";
import { css_color, calcDiv, calcSub, css_background, px, em, View, addOptionEvents, BV, restoreOptions } from ":core";
import { core, defineComponentBundle, mergeComponentOptions } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// A Switch is a boolean control, functionally the same as a checkbox, but fancier.
// It consists of a pair of nested rounded boxes; when the value is false, the inner box is on
// the left and the background is light, and when the value is true, the inner box is on the
// right and the background is dark. A simple CSS transition is used to make the change smooth.
//

export interface SwitchOptions extends BoxOptions {
  backgroundOn?: css_background;
  backgroundOff?: css_background;
  circleColor?: css_color;
  widthInEm?: number;
}
defineComponentBundle<SwitchOptions>("Switch", "Box", {
  widthInEm: 4,
  rounding: core.rounding.r4,
  border: core.border.thin,
  padding: core.space.s0,
  font: core.font.body_medium,
  backgroundOn: core.color.primary,
  backgroundOff: core.color.secondaryContainer,
  circleColor: core.color.white,
});

export function Switch(value: Atom<boolean>, inOptions: BV<SwitchOptions> = {}): View {
  const options = mergeComponentOptions("Switch", inOptions);

  addOptionEvents(options, { click: (): void => value.set(!value.get()) });
  options.background = atom(() => (zget(value) ? zget(options.backgroundOn)! : zget(options.backgroundOff)!));
  options.width = em(options.widthInEm!);
  const diameter = calcDiv(options.width, 2);
  const sz = calcSub(diameter, px(2));

  return restoreOptions(
    Box(options).append(
      Box({
        rounding: core.rounding.circle,
        left: atom(() => (zget(value) ? diameter : px(0))),
        width: sz,
        height: sz,
        background: options.circleColor,
        transition: "left 0.25s",
      })
    )
  );
}
