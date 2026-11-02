import { CarouselAtom, znumber } from ":foundation";
import { ChildCreator, addClass, afterOptionsMerged } from ":core";
import { Button } from "../Controls";
import { Ensemble, Stack, StackOptions } from "../Layout";

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
  preloadList?: string[];
  intervalMillis?: znumber;
}

// TODO: show loading view while images are being loaded

export const Carousel = (key: CarouselAtom<string>, childCreator: ChildCreator<string>, inOptions: CarouselOptions = {}) => {
  const options = addClass(inOptions, "Carousel");

  afterOptionsMerged(options, (view) => {
    // set up a timer; if this is set, the carousel will move automatically to the
    // next view when the timer expires
    if (options.intervalMillis) {
      view.addIntersectionTimer(options.intervalMillis, () => key.next());
    }
    view.append(
      Button({
        cls: "Carousel.LeftButton",
        action: () => key.previous(),
      }),
      Ensemble(key, childCreator, {
        name: "carousel-ensemble",
        preloadList: options.preloadList,
      }),
      Button({
        cls: "Carousel.RightButton",
        action: () => key.next(),
      }),
    );
  });

  return Stack(options);
};
