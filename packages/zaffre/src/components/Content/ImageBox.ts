import { BasicAction, zget, zstring, resolveURI, zlog, zboolean, Atom } from ":foundation";
import { SVGConstants, View, addClass, afterAddedToDOM, afterOptionsMerged, loadSourceContent } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// Box containing an HTML <image> element.
//
// TODO: use fetch() instead of relying on the img element to retrieve the image. This should give us
// more control over error situations.
//

export interface ImageBoxOptions extends BoxOptions {
  preload?: boolean;
  dblClickAction?: BasicAction;
  alt?: string;
  useFetch?: boolean;
  fallbackURI?: zstring;
}

export const EmptyImage = () => {
  return ImageWithSVG(EmptyImageContent());
};
export const EmptyImageContent = () => {
  return ImageContentWithSVG("");
};
export const ImageContentWithSVG = (svg: string) => {
  return svg.startsWith("<svg") ? svg : `data:image/svg+xml;utf8,%3Csvg%20xmlns='${SVGConstants.NS}'${encodeURIComponent(svg)}%3E%3C/svg%3E`;
};
export const ImageWithSVG = (svg: string) => {
  return ImageBox(ImageContentWithSVG(svg));
}

export const ImageBox = (uri: zstring, inOptions: ImageBoxOptions = {}) => {
  const options = addClass(inOptions, "ImageBox");
  options.tag = "img";
  options.model = uri;
  options.useFetch = true;

  afterOptionsMerged(options, () => {
    if (options.preload) {
      const img = document.createElement("img");
      img.setAttribute("src", resolveURI(uri));
    }
    if (options.dblClickAction) {
      options.events = {
        dblClick: options.dblClickAction,
      };
    }
    const showFallback = (elt: HTMLImageElement) => {
      const url = resolveURI(zget(options.fallbackURI || ""));
      zlog.error(`showFallback: no URL for '${zget(uri)}'`);
      elt.src = url;
    };
    const installFallback = (view: View) => {
      const elt = <HTMLImageElement>view.elt;
      elt.onerror = () => showFallback(elt);
    };
    if (options.fallbackURI) {
      if (zget(uri)) {
        afterAddedToDOM(options, (view) => installFallback(view));
      }
    }
  });

  options.onApplyContent = (view) => {
    loadSourceContent(uri, view);
  }
    
  return Box(options);
};
