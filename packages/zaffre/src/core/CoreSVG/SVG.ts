import { zlength, zstring, zrect2D, Point2D, zboolean, zget } from ":foundation";
import { RectToken, rectToken } from ":attributes";
import { BV, restoreOptions, View, viewThatTriggeredEvent } from ":view";
import { defineComponentBundle, mergeComponentOptions } from ":view";
import { CSSAttributeOptions } from "../CoreOptions";
import { SVGOptions } from "./SVGOptions";
import { CreateSVGView, getSVGPointFromEvent } from "./SVGDelegate";

//
// SVG is a view with an <svg> element. This is the only SVG component that may be added
// to an HTML component.
//

export interface SVGContainerOptions extends CSSAttributeOptions, SVGOptions {
  bounds?: zrect2D;
  viewBox?: RectToken;
  x?: zlength;
  y?: zlength;
  preserveAspectRatio?: zstring;
  draggableElements?: zboolean;
}
defineComponentBundle<SVGContainerOptions>("SVGContainer", "", {
  tag: "svg",
});

export function SVG(inOptions: BV<SVGContainerOptions> = {}): View {
  const options = mergeComponentOptions("SVGContainer", inOptions);
  if (options.bounds) {
    options.viewBox = rectToken(options.bounds);
  }

  // Drag management for views within this container. This is necessary because SVGElements
  // do not deal with drag events natively. To support this, we handle pointer events at the
  // container level, and keep track of the drag state here. A view that is draggable must
  // have an onDrag option which should change a model value that in turn affects one of more
  // of the element attributes.
  //
  // TODO:
  //  - ensure this plays nicely with other events defined on the subviews

  let dragView: View | undefined = undefined;
  let lastPt: Point2D;

  function handlePointerEvent(evt: PointerEvent, fn: (view: View, evt: PointerEvent) => void): void {
    const view = <View>viewThatTriggeredEvent(evt);
    const options = <SVGOptions>view.options;
    if (dragView || (view && zget(options.draggable))) {
      evt.preventDefault();
      fn(view, evt);
    }
  }
  function startDrag(view: View, evt: PointerEvent): void {
    view.elt.setPointerCapture(evt.pointerId);
    dragView = view;
    lastPt = getSVGPointFromEvent(evt);
    const options = <SVGOptions>dragView.options;
    options.onDragStart?.(lastPt);
  }
  function drag(view: View, evt: PointerEvent): void {
    if (dragView) {
      const options = <SVGOptions>dragView.options;
      const pt = getSVGPointFromEvent(evt);
      options.onDrag?.(pt.subtract(lastPt));
      lastPt = pt;
    }
  }
  function endDrag(view: View, evt: PointerEvent): void {
    view.elt.releasePointerCapture(evt.pointerId);
    const options = <SVGOptions>dragView?.options;
    options.onDragEnd?.(getSVGPointFromEvent(evt));
    dragView = undefined;
  }

  if (options.draggableElements) {
    options.events = {
      pointerDown: (evt): void => handlePointerEvent(evt, (view, evt) => startDrag(view, evt)),
      pointerMove: (evt): void => handlePointerEvent(evt, (view, evt) => drag(view, evt)),
      pointerUp: (evt): void => handlePointerEvent(evt, (view, evt) => endDrag(view, evt)),
    };
  }
  return restoreOptions(CreateSVGView("svg", SVG.svgKeys, SVG.cssKeys, options));
}

export const SVGViewCSSKeys = ["transform", "fill", "filter", "transition", "pointerEvents", "cursor", "visibility"];
export const SVGViewSVGKeys = ["id"];

SVG.cssKeys = [...SVGViewCSSKeys, "border", "display"];
SVG.svgKeys = [...SVGViewSVGKeys, "viewBox", "x", "y", "width", "height", "preserveAspectRatio"];
