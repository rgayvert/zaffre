import { lazyinit, ZType, znumber, zlength, zstring, zrect2D, Point2D, point2D, zboolean, zget } from ":foundation";
import { RectToken, rectToken, css_cursor, css_filter, css_pointerEvents, css_visibility } from ":attributes";
import { Attributes } from ":attributes";
import { Effects, standardSVGInteractionEffects } from ":effect";
import { CSSOptions, View, ViewOptions, viewWithEventListener, viewThatTriggeredEvent, ViewDelegate } from ":view";
import { defineComponentDefaults, mergeComponentDefaults } from "../Theme";
import { SVGPaint } from "./SVGOptions";

//
//
//

export enum SVGConstants {
  NS = "http://www.w3.org/2000/svg",
}

export interface SVGFilterPrimitiveOptions {
  x?: znumber;
  y?: znumber;
  width?: ZType<number | string>;
  height?: ZType<number | string>;
  result?: zstring;
}
export const SVGFilterPrimitiveSVGKeys = ["x", "y", "width", "height", "result"];

export type SVGDragFn = (pt: Point2D) => void;

export interface SVGOptions extends ViewOptions {
  tag?: string;
  id?: string;
  transform?: zstring;
  fill?: SVGPaint; // css_color | zstring;
  fillOpacity?: znumber;
  pointerEvents?: css_pointerEvents;
  visibility?: css_visibility;
  rect?: zrect2D;
  filter?: css_filter;
  cursor?: css_cursor;
  transition?: zstring;
  draggable?: zboolean;
  onDragStart?: SVGDragFn;
  onDrag?: SVGDragFn;
  onDragEnd?: SVGDragFn;
}

export function getSVGPointFromEvent(evt: MouseEvent): Point2D {
  const target = viewWithEventListener(evt);
  if (target?.delegate instanceof SVGDelegate) {
    const svgElt = <SVGGraphicsElement>target.delegate.svgElt;
    const pt = new DOMPoint(evt.clientX, evt.clientY);
    const svgPt = pt.matrixTransform(svgElt.getScreenCTM()?.inverse());
    return point2D(svgPt.x, svgPt.y);
  } else {
    return point2D(0, 0);
  }
}

export function CreateSVGView(
  tagName: string,
  svgKeys: string[],
  cssKeys: string[],
  options: ViewOptions = {}
): View {
  options.tag = tagName;
  return new View(new SVGDelegate(svgKeys, cssKeys), options);
}
export const SVGViewCSSKeys = ["transform", "fill", "filter", "transition", "pointerEvents", "cursor", "visibility"];
export const SVGViewSVGKeys = ["id"];

export function isSVGView(view: View | undefined): boolean {
  return Boolean(view && view.delegate instanceof SVGDelegate);
}

export class SVGDelegate extends ViewDelegate {
  @lazyinit public static get defaultOptions(): ViewOptions {
    return {};
  }

  get options(): SVGOptions {
    return this.view.options;
  }

  cssAttributes(): Attributes {
    return <Attributes>Object.fromEntries(this.cssKeys.map((key) => [key, (this.options as any)[key]]));
  }
  svgAttributes(): Attributes {
    return <Attributes>Object.fromEntries(this.svgKeys.map((key) => [key, (this.options as any)[key]]));
  }
  public svgAttributeSummary(): string {
    let summary = "";
    Object.entries(this.svgAttributes()).forEach(([key, value]) => {
      if (value) {
        summary += `  ${key}: ${value}\n`;
      }
    });
    return summary ? "\nsvg properties:\n" + summary : "";
  }
  //////////////////////////////////////////////////////////////////////////////

  constructor(public svgKeys: string[], public cssKeys: string[]) {
    super();
  }

  //////////////////////////////////////////////////////////////////////////////

  // Delegate methods

  get svgElt(): SVGElement {
    return <SVGElement>this.view.elt;
  }
  createElement(tagName: string): SVGElement {
    return document.createElementNS(SVGConstants.NS, tagName);
  }
  tagName(): string {
    return this.options.tag || "div";
  }
  offsetLeft(): number {
    return this.view.clientRect().x - this.view.parentClientRect2D().x;
  }
  offsetTop(): number {
    return this.view.clientRect().y - this.view.parentClientRect2D().y;
  }
  get overlay(): View {
    return this.view;
  }
  setCSSClass(clsName: string): void {
    this.svgElt.setAttribute("class", clsName);
  }
  // Interaction effects are applied directly the SVG view, not to an overlay
  public defaultInteractionEffects(): Effects {
    return standardSVGInteractionEffects();
  }

  widthOfChildren(): number {
    if (this.view.elt.children.length === 0) {
      return 0;
    }
    const child = <SVGTextElement>this.view.elt.children[0];
    return child.getBBox().width;
  }

  isContainer(): boolean {
    return this.options.tag === "svg";
  }
  container(): View | undefined {
    if (this.isContainer()) {
      return this.view;
    } else {
      const parent = this.view.parent;
      if (parent && isSVGView(parent)) {
        return (<SVGDelegate>parent.delegate).container();
      } else {
        return undefined;
      }
    }
  }

  animatingView(): View {
    return this.container() || this.view;
  }
}

export interface SVGContainerOptions extends CSSOptions, SVGOptions {
  bounds?: zrect2D;
  viewBox?: RectToken;
  x?: zlength;
  y?: zlength;
  preserveAspectRatio?: zstring;
  draggableElements?: zboolean;
}
defineComponentDefaults<SVGContainerOptions>("SVGContainer", "", {
  //bounds: rect2D(0, 0, 100, 100),
  tag: "svg",
});

export function SVG(inOptions: SVGContainerOptions): View {
  const options = mergeComponentDefaults("SVGContainer", inOptions);
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
      //pointerLeave: (evt): void => handlePointerEvent(evt, (view, evt) => endDrag(view, evt)),
    };
  }
  return CreateSVGView("svg", SVG.svgKeys, SVG.cssKeys, options);
}
SVG.cssKeys = [...SVGViewCSSKeys, "border", "display"];
SVG.svgKeys = [...SVGViewSVGKeys, "viewBox", "x", "y", "width", "height", "preserveAspectRatio"];
