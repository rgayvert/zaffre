import { zget, atom, Atom } from ":foundation";
import { View, addClass, beforeAddedToDOM, zborder } from ":core";
import { TextLabel, LabelOptions } from "../Content";
import { Box, FloatingContainer, floatingCount } from "../HTML";

//
// A Tooltip is a special floating component that is used by all descendants of a
// particular component. Typically, an application will add a single BasicTooltip to
// the top-level component, so a single tooltip instance will be shared by all
// components which have a tooltip option. Each view can have a placement option to
// indicate where the tooltip should be placed. The tooltip will use this if possible,
// but may choose a different placement if necessary to make the tooltip visible.
//

export interface TooltipOptions extends LabelOptions {
  textOptions?: LabelOptions;
  textCreator?: (tip: Atom<string>) => View;
}


const DefaultTooltipText = (tip: Atom<string>) => {
  return TextLabel(tip);
};
export const Tooltip = (inOptions: TooltipOptions = {}) => {
  const options = addClass(inOptions, "Tooltip");

  const tip = atom("");
  const delayBeforeShowing = 1500;
  const delayBeforeHiding = 300;
  const hidden = atom(true);
  const noPopups = atom(() => floatingCount.get() < 2);
  const triggered = atom(false);
  let lastShowTime = 0;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const readyToShow = atom(() => [!hidden.get(), tip.get(), triggered.get(), noPopups.get()].every(Boolean));

  options.hidden = atom(() => !readyToShow.get());
  options.border = zborder.thin;

  const setTrigger = (val: boolean): void => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    triggered.set(val);
  };

  beforeAddedToDOM(options, (tooltipView: View): void => {
    readyToShow.addAction((val) => {
      hidden.set(!val);
      if (val) {
        tooltipView.place();
      }
    });
  });

  // this is called by a view with a hover interaction state (see View.addTooltipHandler)
  options.onTooltip = (tooltipView: View, referenceView: View, text: string, show: boolean): void => {
    // determine placement from referenceView
    tooltipView.options.placement = referenceView.options.tooltipPlacement;

    tip.set(text);
    hidden.set(!show);
    if (timeout && !show) {
      setTrigger(false);
    } else if (show) {
      tip.set(zget(tip));
      tooltipView.referenceView = referenceView;
      if (performance.now() - lastShowTime < delayBeforeHiding) {
        triggered.set(true);
      } else {
        timeout = setTimeout(() => setTrigger(true), delayBeforeShowing);
      }
    } else {
      setTrigger(false);
      lastShowTime = performance.now();
    }
  };

  const textCreator = options.textCreator || DefaultTooltipText;

  return FloatingContainer({
    hidden: hidden,
  }).append(Box(options).append(textCreator(tip)));
};
