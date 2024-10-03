import { CarouselAtom, znumber, zstring } from ":foundation";
import { coreColorEffect, ChildCreator, View, afterAddedToDOM, BV } from ":core";
import { core, defineBaseOptions, mergeComponentOptions } from ":core";
import { Button, ButtonOptions } from "../Controls";
import { Ensemble, HStack, StackOptions } from "../Layout";

//
// A simple carousel view which displays a set of views with a pair of left-right buttons
// to navigate through the views. An interval may also be specified to flip through the views
// automatically after some delay.
//
// The basic idea is to use an Ensemble to control which view is being displayed, which
// in turn uses a CarouselAtom to hold the list of keys, and move the current key forward and
// backward (key.next() and key.previous())
//
// See CarouselExample for an example with images that fade in and out. For images, the
// preloadList option should be used so that the ensemble will create all of the image elements
// when the view is created, which will minimize the lag in loading the images.
//

export interface CarouselOptions extends StackOptions {
  leftIcon?: zstring;
  rightIcon?: zstring;
  preloadList?: string[];
  intervalMillis?: znumber;
}
defineBaseOptions<CarouselOptions>("Carousel", "HStack", {
  leftIcon: "icon.chevron-left",
  rightIcon: "icon.chevron-right",
  intervalMillis: 0,
});

export function Carousel(
  key: CarouselAtom<string>,
  childCreator: ChildCreator<string>,
  inOptions: BV<CarouselOptions> = {}
): View {
  const options = mergeComponentOptions("Carousel", inOptions);
  afterAddedToDOM(options, (view: View): void => {
    if (options.intervalMillis) {
      view.addIntersectionTimer(options.intervalMillis, () => key.next());
    }
  });
  const buttonOptions: ButtonOptions = {
    color: core.color.primaryContainer,
    font: core.font.display_medium,
    border: core.border.none,
    effects: {
      hovered: coreColorEffect(core.color.primary),
    },
  };
  return HStack({ gap: core.space.s0 }).append(
    Button({ ...buttonOptions, leadingIconURI: options.leftIcon, action: () => key.previous() }),
    Ensemble(key, childCreator, options),
    Button({ ...buttonOptions, leadingIconURI: options.rightIcon, action: () => key.next() })
  );
}
