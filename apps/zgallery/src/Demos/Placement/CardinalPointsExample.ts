import { View, core, atom, Box, HStack, ch, TextBox, pct, beforeAddedToDOM, point2D, Rect2D, BoxOptions } from "zaffre";
import { closestCardinalPoint, Placement } from "zaffre";

export function CardinalPointsExample(): View {
  let boxView: View;
  const mousePt = atom(point2D(0, 0));
  const refPt = atom(() => closestCardinalPoint(boxView?.clientRect() || Rect2D.emptyRect, mousePt.get()));
  const boxPlace = atom<Placement>(() => ({ referencePt: refPt.get(), viewPt: "xcenter-ycenter" }));
  const boxOptions: BoxOptions = {
    events: { pointerMove: (evt) => mousePt.set(point2D(evt.clientX, evt.clientY)) },
    width: ch(20),
    height: ch(20),
    border: core.border.thin,
    margin: core.space.s6,
  };

  beforeAddedToDOM(boxOptions, (view) => {
    boxView = view;
  });

  return HStack({ gap: core.space.s5 }).append(
    Box(boxOptions).append(
      Box({
        transition: "all 0.2s",
        width: ch(4),
        height: ch(4),
        background: core.color.red,
        placement: boxPlace,
      }),
      TextBox("The red box will follow the cursor to the nearest cardinal point on the outer box", {
        cursor: "default",
        width: pct(100),
        height: pct(100),
        padding: core.space.s4,
      })
    )
  );
}
