import { zstring } from ":foundation";
import { View, SVGConstants, resolveURI, core, defineBaseOptions, mergeComponentOptions, beforeAddedToDOM, BV } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// Box containing an HTML <image> element.
//
//

export interface ImageBoxOptions extends BoxOptions {
  preload?: boolean;
}
defineBaseOptions<ImageBoxOptions>("ImageBox", "Box", {
  background: core.color.none,
  draggable: false,
  preload: false,
});

export function EmptyImage(): View {
  return ImageWithSVG("");
}
export function ImageWithSVG(svg: string): View {
  const fullSVG = svg.startsWith("<svg") ? svg : `<svg xmlns="${SVGConstants.NS}" ${svg}</svg>`;
  const content = `data:image/svg+xml;utf8,${encodeURIComponent(fullSVG)}`;
  return ImageBox(content);
}

export function ImageBox(uri: zstring, inOptions: BV<ImageBoxOptions> = {}): View {
  const options = mergeComponentOptions("ImageBox", inOptions);
  options.model = uri;
  if (options.preload) {
    const img = document.createElement("img");
    img.setAttribute("src", resolveURI(uri));
  }

  function setImageSrc(view: View, uri: zstring): void {
    view.elt.setAttribute("src", resolveURI(uri));
  }

  options.tag = "img";
  options.onGetContent = (): string => resolveURI(uri);
  options.onApplyContent = (view): void => setImageSrc(view, uri);

  return Box(options);
}
