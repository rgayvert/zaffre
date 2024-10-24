import { afterAddedToDOM, atom, Atom, Box, BoxOptions, BV, core, CSSPointerEvents, restoreOptions } from "zaffre";
import { defineComponentBundle, mergeComponentOptions, px, View } from "zaffre";

export interface VideoPlayerOverlayOptions extends BoxOptions {
  disablePlayer?: Atom<boolean>;
}
defineComponentBundle<VideoPlayerOverlayOptions>("VideoPlayerOverlay", "Box", {
  background: core.color.transparent,
  outline: "none",
  position: "absolute",
  top: px(0),
});

export function VideoPlayerOverlay(inOptions: BV<VideoPlayerOverlayOptions> = {}): View {
  const options = mergeComponentOptions("VideoPlayerOverlay", inOptions);
  let view: View;
  if (options.disablePlayer) {
    options.pointerEvents = atom<CSSPointerEvents>(() => (options.disablePlayer?.get() ? "auto" : "none"));
  }
  afterAddedToDOM(options, (v: View): void => {
    view = v;
    view.addEventListener("click", () => view?.focus(), true);
  });

  return restoreOptions(Box(options));
}
