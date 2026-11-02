import { ZArray, atom, zaget, zboolean, zget } from ":foundation";
import { addClass, afterOptionsMerged, css_length, View, zcolor } from ":core";
import { Stack, StackOptions, ViewList } from "../Layout";
import { Box, BoxOptions } from "../HTML";

//
// A Dots component is a stack of simple shapes that are open or filled.
// Which shapes are filled is determined by an array of boolean values.
// For a carousel, this array will have only one value set to true. For a
// gauge style, the array would be filled in up to a particular index.
//
// TODO: allow Dots to be interactive
//

export interface DotOptions extends BoxOptions {
  dotSize?: css_length;
}

export interface DotsOptions extends StackOptions {
  dotCreator?: (index: number, value: zboolean, options: DotOptions) => View;
}

const DefaultDot = (_index: number, value: zboolean, inOptions: DotOptions = {}) => {
  const options = addClass(inOptions, "Dot");
  
  afterOptionsMerged(options, () => {
    options.background = atom(() => (zget(value) ? zget(options.color) : zcolor.inherit));
  });

  return Box(options);
};

export const Dots = (values: ZArray<boolean>, inOptions: DotsOptions = {}) => {
  const options = addClass(inOptions, "Dots");
  options.model = values;
  
  const v = atom("a");
  const vs = zget(v);
  const vals = zget(values);

  const dotCreator = options.dotCreator || DefaultDot;

  return Stack(options).append(
    ViewList(
      values,
      (_val, index) => index,
      (_val, index) =>
        dotCreator(
          index,
          atom(() => zaget(values)[index]),
          {},
        ),
    ),
  );
};
