import { zget, atom, Atom } from ":foundation";
import { View, beforeAddedToDOM, core, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { TextLabelOptions, TextLabel } from "../Content";
import { Box, Floating, floatingCount } from "../HTML";

//
// A Tooltip is a special floating component that is used by all descendants of a
// particular component. Typically, an application will add a single BasicTooltip to
// the top-level component, so a single tooltip instance will be shared by all 
// components which have a tooltip option. Each view can have a placement option to 
// indicate where the tooltip should be placed. The tooltip will use this if possible,
// but may choose a different placement if necessary to make the tooltip visible.
//

export interface TooltipOptions extends TextLabelOptions {
  textOptions?: TextLabelOptions;
  textCreator?: (tip: Atom<string>) => View;
}
defineComponentDefaults<TooltipOptions>("BasicTooltip", "Box", {
  padding: core.space.s2,
  background: core.color.tertiaryContainer,
  pointerEvents: "none",
  zIndex: 999,
  opacity: 0.9,
  elevation: 0,
  textCreator: DefaultTooltipText,
  name: "Tooltip",
});

function DefaultTooltipText(tip: Atom<string>): View {
  const options: TextLabelOptions = {
    color: core.color.blue,
    font: core.font.label_small,
  };
  return TextLabel(tip, options);
}
export function BasicTooltip(inOptions: TooltipOptions = {}): View {
  const options = mergeComponentDefaults("BasicTooltip", inOptions);

  const tip = atom("");
  const delayBeforeShowing = 1500;
  const delayBeforeHiding = 300;
  const visible = atom(false);
  const noPopups = atom(() => floatingCount.get() < 2);
  const triggered = atom(false);
  let lastShowTime = 0;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const readyToShow = atom(() => [visible.get(), tip.get(), triggered.get(), noPopups.get()].every(Boolean));

  options.hidden = atom(() => !readyToShow.get());
  options.border = core.border.thin;

  function setTrigger(val: boolean): void {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    triggered.set(val);
  }

  beforeAddedToDOM(options, (tooltipView: View): void => {
    readyToShow.addAction((val) => {
      visible.set(val);
      if (val) {
        tooltipView.place();
      }
    });
  });

  options.onTooltip = (tooltipView: View, referenceView: View, text: string, show: boolean): void => {
    // determine placement from referenceView
    tooltipView.options.placement = referenceView.options.tooltipPlacement;

    tip.set(text);
    visible.set(show);
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

  return Floating(Box(options).append(options.textCreator!(tip)), {
    showOnReferenceClick: false,
    background: core.color.transparent,
  });
}
