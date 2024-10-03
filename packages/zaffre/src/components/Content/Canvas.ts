import { zget, znumber, zstring, Atom, atom, zlog } from ":foundation";
import { View, resolveURI, beforeAddedToDOM, core, defineBaseOptions, mergeComponentOptions, BV } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// A Canvas is a content component based on an HTML <canvas> element. The primary use currently
// is for some simple image manipulation.
//
// TODO: do we need to do much more here given what we can do in SVG? Maybe if we wanted to
// make a reactive image editor?
//

export interface CanvasOptions extends BoxOptions {
  image?: Atom<HTMLImageElement>;
  pixelWidth?: znumber;
  pixelHeight?: znumber;
  imageSrc?: zstring;
}
defineBaseOptions<CanvasOptions>("Canvas", "Box", {
  color: core.color.primary,
  background: core.color.background,
  tag: "canvas",
});

export function Canvas(inOptions: BV<CanvasOptions> = {}): View {
  const options = mergeComponentOptions("Canvas", inOptions);

  let image: Atom<HTMLImageElement | undefined>;
  let ctx: CanvasRenderingContext2D | null;
  let currentView: View;

  if (options.imageSrc) {
    image = atom(undefined);
    options.pixelWidth = atom(() => zget(image)?.width || 0);
    options.pixelHeight = atom(() => zget(image)?.height || 0);
    options.hidden = atom(() => zget(image) === undefined);
    options.onGetContent = (): string => zget(options.imageSrc || "");
  }
  options.html_width = atom(() => zget(options.pixelWidth || 0));
  options.html_height = atom(() => zget(options.pixelHeight || 0));

  beforeAddedToDOM(options, (view: View): void => {
    currentView = view;
    ctx = (<HTMLCanvasElement>view.elt).getContext("2d");
    const viewOptions = <CanvasOptions>view.options;
    if (ctx && viewOptions.filter instanceof Atom) {
      viewOptions.filter.addAction(() => setFilter());
    }
  });

  options.onApplyContent = (_view: View): void => {
    loadImage();
  };
  function setFilter(): void {
    if (ctx) {
      ctx.filter = zget(options.filter)?.toString() || "";
    }
  }
  async function loadImage(): Promise<void> {
    const src = resolveURI(options.imageSrc!);
    if (src) {
      const img = document.createElement("img");
      img.src = src;
      try {
        await img.decode();
        image.set(img);
        // setting the image resets the canvas, so we need to reapply the filter
        setFilter();
        ctx?.drawImage(img, 0, 0);
      } catch (e) {
        zlog.info("failed to load " + src + ": " + e);
      }
    }
  }
  return Box(options);
}
