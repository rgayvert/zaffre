import { atom, zget, Atom, zboolean } from ":foundation";
import { addClass, afterOptionsMerged, calcDiv, calcSub, css_background, css_color, View } from ":core";
import { px, em } from ":core";
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

export const Switch = (value: Atom<boolean>, inOptions: SwitchOptions = {}) => {
  const options = addClass(inOptions, "Switch");
  options.model = value;

  afterOptionsMerged(options, (view) => {
    // outer box
    options.background = atom(() => (zget(value) ? zget(options.backgroundOn)! : zget(options.backgroundOff)!));
    options.width = em(options.widthInEm!);
    options.clickAction = () => value.set(!value.get());

    // inner box
    const diameter = calcDiv(options.width, 2);
    const sz = calcSub(diameter, px(2));
    const circleOptions: BoxOptions = {
      name: "Switch_Box",
      left: () => (zget(value) ? diameter : px(0)),
      width: sz,
      height: sz,
      background: options.circleColor,
    };

    view.append(Box(circleOptions));
  });

  return Box(options);
};

