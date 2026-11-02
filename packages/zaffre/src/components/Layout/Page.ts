import { addClass } from ":view";
import { Box, BoxOptions } from "../HTML";

//
// A Page is primarily intended for top-level page layout.
//
// TODO
//  - should this be a stack?
//  - should this support "on this page"? (probably something distinct)
//

export interface PageOptions extends BoxOptions {}

export const Page = (inOptions: PageOptions = {}) => {
  const options = addClass(inOptions, "Page");

  return Box(options);
};
