import { addClass, HTML, HTMLOptions } from ":core";

//
// A Box is the most basic HTML component. Usually used as a simple container,
// sometimes with a border and/or background.
//

export interface BoxOptions extends HTMLOptions {}

export const Box = (inOptions: BoxOptions = {}) => {
  const options = addClass(inOptions, "Box");
  return HTML(options);
};


