import { zstring } from ":foundation";
import { View, SVGConstants, resolveURI, core, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// Box containing an HTML <image> element.
//
// TODO: is lazy of any utility?
//

export interface ImageBoxOptions extends BoxOptions {
  lazy?: boolean;
}
defineComponentDefaults<ImageBoxOptions>("ImageBox", "Box", {
  background: core.color.none,
  draggable: false,
  lazy: false,
});

export function EmptyImage(): View {
  return ImageWithSVG("");
}
export function ImageWithSVG(svg: string): View {
  const fullSVG = svg.startsWith("<svg") ? svg : `<svg xmlns="${SVGConstants.NS}" ${svg}</svg>`;
  const content = `data:image/svg+xml;utf8,${encodeURIComponent(fullSVG)}`;
  return ImageBox(content);
}

export function ImageBox(uri: zstring, inOptions: ImageBoxOptions = {}): View {
  const options = mergeComponentDefaults("ImageBox", inOptions);
  options.model = uri;

  function setImageSrc(view: View, uri: zstring): void {
    view.elt.setAttribute("src", resolveURI(uri));
  }

  options.tag = "img";
  options.onGetContent = (): string => resolveURI(uri);
  options.onApplyContent = (view): void => setImageSrc(view, uri);

  return Box(options);
}
