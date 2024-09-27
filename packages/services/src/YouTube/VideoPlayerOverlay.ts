import { afterAddedToDOM, atom, Atom, Box, BoxOptions, core, CSSPointerEvents } from "zaffre";
import { defineComponentDefaults, mergeComponentDefaults, px, View } from "zaffre";

export interface VideoPlayerOverlayOptions extends BoxOptions {
  disablePlayer?: Atom<boolean>;
}
defineComponentDefaults<VideoPlayerOverlayOptions>("VideoPlayerOverlay", "Box", {
  background: core.color.transparent,
  outline: "none",
  position: "absolute",
  top: px(0),
});

export function VideoPlayerOverlay(inOptions: VideoPlayerOverlayOptions = {}): View {
  const options = mergeComponentDefaults("VideoPlayerOverlay", inOptions);
  let view: View;
  if (options.disablePlayer) {
    options.pointerEvents = atom<CSSPointerEvents>(() => (options.disablePlayer?.get() ? "auto" : "none"));
  }
  afterAddedToDOM(options, (v: View): void => {
    view = v; 
    view.addEventListener("click", () => view?.focus(), true);
  });

  return Box(options);
}
