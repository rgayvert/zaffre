import { addClass, afterOptionsMerged, Atom, atom, Box, BoxOptions, CSSPointerEvents } from "zaffre";

// TODO: move events into component rules

export interface VideoPlayerOverlayOptions extends BoxOptions {
  disablePlayer?: Atom<boolean>;
}
export const VideoPlayerOverlay = (inOptions: VideoPlayerOverlayOptions = {}) => {
  const options = addClass(inOptions, "VideoPlayerOverlay");
  
  afterOptionsMerged(options, (view) => {
    view.addEventListener("click", () => view?.focus(), true);
    if (options.disablePlayer) {
      options.pointerEvents = atom<CSSPointerEvents>(() => (options.disablePlayer?.get() ? "auto" : "none"));
    }
  });
  return Box(options);
};
