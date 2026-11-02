import { zget, Atom, atom, zutil, rect2D, point2D, Point2D, znumber, zboolean, BasicAction } from ":foundation";
import { SVG, SVGLine, SVGCircle, SVGContainerOptions, getSVGPointFromEvent, addClass, css_color, afterOptionsMerged } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// A Slider allows a numeric value to be specified by dragging a knob or by clicking
// along an axis. The position of the knob is tied to a reactive value. This is implemented
// in SVG using a pair of lines and a filled, draggable circle.
//
// TODO: the radius/strokewidth notion is wonky; need a better way to specify this relationship
//

export interface SliderOptions extends BoxOptions {
  leftColor?: css_color;
  rightColor?: css_color;
  knobColor?: css_color;
  radiusRatio?: znumber; // width / radius
  minVal?: number;
  maxVal?: number;
  round?: zboolean;
  onDragStart?: BasicAction; // applied to circle
  onDragEnd?: BasicAction; // applied to circle
}

export const Slider = (value: Atom<number>, inOptions: SliderOptions = {}) => {
  inOptions.opacity = () => (zget(options.disabled) ? 0.3 : 1.0);
  const options = addClass(inOptions, "Slider");
  options.model = value;

  afterOptionsMerged(options, (view) => {
    const minVal = options.minVal || 0;
    const maxVal = options.maxVal || 100;
    const radius = 100 / (zget(options.radiusRatio) || 20);
    const r2 = radius * 1.05;

    // convert user value in [minVal, maxVal] to slider value in [0, 100]
    const u2s = (u: number): number => {
      return ((u - minVal) / (maxVal - minVal)) * 100;
    };
    // convert slider value in [0, 100] to user value in [minVal, maxVal]
    const s2u = (sx: number): number => {
      return (sx / 100) * (maxVal - minVal) + minVal;
    };
    const updateValue = (deltaS: number): void => {
      const sx = zutil.clamp(u2s(value.get()) + deltaS, 0, 100);
      value.set(s2u(sx));
    };
    const sliderClicked = (evt: MouseEvent): void => {
      const sx = zutil.clamp(getSVGPointFromEvent(evt).x, 0, 100);
      value.set(s2u(sx));
    };
    const Circle = () => {
      return SVGCircle({
        cx: () => u2s(value.get()),
        cy: 0,
        r: radius,
        fill: () => options.knobColor,
        draggable: true,
        onDrag: (delta: Point2D) => updateValue(delta.x),
        onDragStart: options.onDragStart,
        onDragEnd: options.onDragEnd,
      });
    };
    const LeftLine = () => {
      return SVGLine({
        pt1: atom(() => point2D(-radius / 2, 0)),
        pt2: atom(() => point2D(u2s(value.get()), 0)),
        stroke: () => options.leftColor,
        strokeWidth: () => radius / 3,
      });
    };
    const RightLine = () => {
      return SVGLine({
        pt1: atom(() => point2D(u2s(value.get()), 0)),
        pt2: atom(() => point2D(100 + radius / 2, 0)),
        stroke: () => options.rightColor,
        strokeWidth: () => radius / 6,
      });
    };

    const svgOptions: SVGContainerOptions = {
      bounds: atom(() => rect2D(-radius, -r2, 100 + radius * 2, r2 * 2)),
      draggableElements: true,
      disabled: options.disabled,
      height: options.height,
      display: "block",
      clickAction: (evt: MouseEvent) => sliderClicked(evt),
    };

    view.append(SVG(svgOptions).append(LeftLine(), RightLine(), Circle()));
  });

  return Box(options);
};
