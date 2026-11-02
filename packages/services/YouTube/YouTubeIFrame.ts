import { atom, Box, zcolor, addClass, IFrameOptions, Atom, afterOptionsMerged } from "zaffre";
import { createYouTubePlayer, YouTubePlayerConfig, YTPlayer } from "./YouTubePlayer";

const watchingForBlur = false;
const watchForBlur = () => {
  setInterval(() => {
    if (document.activeElement instanceof HTMLIFrameElement) {
      document.activeElement.blur();
    }
  }, 1000);
};

export interface YouTubeIFrameOptions extends IFrameOptions {
  seekTime?: Atom<number>;
  controls?: boolean;
  disableKeyboard?: boolean;
  allowFullscreen?: boolean;
  blurOnFocus?: boolean;
}

export const YouTubeIFrame = (videoID: string, player: YTPlayer, inOptions: YouTubeIFrameOptions = {}) => {
  const options = addClass(inOptions, "YouTubeIFrame");
  options.model = player;
  afterOptionsMerged(options, (view) => {
    const ready = atom(false);
    options.background = atom(() => (ready.get() ? zcolor.transparent : zcolor.gray));

    if (options.blurOnFocus && !watchingForBlur) {
      watchForBlur();
    }

    const boxElement = <HTMLElement>view.elt;
    boxElement.id = `yt-${view.viewID}`;

    const playerConfig: YouTubePlayerConfig = {
      videoID: videoID,
      ready: ready,
      boxElement: boxElement,
      controls: options.controls,
      disableKeyboard: options.disableKeyboard,
      allowFullscreen: options.allowFullscreen,
    };

    options.model = [videoID, player, playerConfig];

    createYouTubePlayer(player, playerConfig);
  });
  return Box(options);
};
