import { addClass } from ":view";
import { FormField } from "../Form";
import { Grid, GridOptions } from "../Layout";

//
// A Card is a view that contains a set of standard pieces that can be assembled in a grid.
// A typical card will have a title, subtitle, image, and body text.
// Nothing notable here, just a demonstration of how this can be done.
//

export interface CardOptions extends GridOptions {}

export const Card = <R extends {}>(fields: FormField[], inOptions: CardOptions = {}) => {
  const options = addClass(inOptions, "Card");
  options.model = fields;

  return Grid(options).append(...fields);
};
