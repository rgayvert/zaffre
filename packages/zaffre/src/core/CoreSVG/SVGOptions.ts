import { Point2D, zboolean, znumber, zrect2D, zstring } from ":foundation";
import { ViewOptions } from ":view";
import { css_cursor, css_filter, css_pointerEvents, css_visibility } from ":attributes";
import { SVGPaint } from "../CoreOptions";

//
// Shared options for SVG components
//

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
