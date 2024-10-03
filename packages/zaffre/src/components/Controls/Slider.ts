import { zget, Atom, atom, znumber, zutil, zboolean, BasicAction, rect2D, point2D } from ":foundation";
import { View, SVG, SVGLine, ch, css_color, SVGCircle, SVGContainerOptions, getSVGPointFromEvent, BV } from ":core";
import { core, defineBaseOptions, mergeComponentOptions } from ":core";
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
  sliderColor?: css_color;
  radiusRatio?: znumber; // width / radius
  minVal?: number;
  maxVal?: number;
  round?: zboolean;
  onDragStart?: BasicAction; // applied to circle
  onDragEnd?: BasicAction; // applied to circle
}
defineBaseOptions<SliderOptions>("Slider", "Box", {
  minVal: 0,
  maxVal: 100,
  minWidth: ch(10),
  radiusRatio: 10,
  leftColor: core.color.primary,
  rightColor: core.color.secondary,
  sliderColor: core.color.primary,
  round: false,
});

export function Slider(value: Atom<number>, inOptions: BV<SliderOptions> = {}): View {
  const options = mergeComponentOptions("Slider", inOptions);
  options.model = value;
  const minVal = options.minVal!;
  const maxVal = options.maxVal!;
  const radius = 100 / zget(options.radiusRatio!);
  // provide a bit of vertical space for the circle
  const r2 = radius * 1.05;
  // convert user value in [minVal, maxVal] to slider value in [0, 100]
  function u2s(u: number): number {
    return ((u - minVal) / (maxVal - minVal)) * 100;
  }
  // convert slider value in [0, 100] to user value in [minVal, maxVal]
  function s2u(sx: number): number {
    return (sx / 100) * (maxVal - minVal) + minVal;
  }
  function updateValue(deltaS: number): void {
    const sx = zutil.clamp(u2s(value.get()) + deltaS, 0, 100);
    value.set(s2u(sx));
  }
  function sliderClicked(evt: MouseEvent): void {
    const sx = zutil.clamp(getSVGPointFromEvent(evt).x, 0, 100);
    value.set(s2u(sx));
  }
  function Circle(): View {
    return SVGCircle({
      cx: atom(() => u2s(value.get())),
      cy: 0,
      r: radius,
      fill: options.sliderColor,
      draggable: true,
      onDrag: (delta) => updateValue(delta.x),
      onDragStart: options.onDragStart,
      onDragEnd: options.onDragEnd,
    });
  }
  function LeftLine(): View {
    return SVGLine({
      pt1: atom(() => point2D(-radius / 2, 0)),
      pt2: atom(() => point2D(u2s(value.get()), 0)),
      stroke: options.leftColor,
      strokeWidth: radius / 3,
    });
  }
  function RightLine(): View {
    return SVGLine({
      pt1: atom(() => point2D(u2s(value.get()), 0)),
      pt2: atom(() => point2D(100 + radius / 2, 0)),
      stroke: options.rightColor,
      strokeWidth: radius / 6,
    });
  }

  const svgOptions: SVGContainerOptions = {
    bounds: rect2D(-radius, -r2, 100 + radius * 2, r2 * 2),
    draggableElements: true,
    height: options.height,
    display: "block",
    clickAction: (evt: MouseEvent) => sliderClicked(evt),
  };
  return Box(options).append(SVG(svgOptions).append(LeftLine(), RightLine(), Circle()));
}
