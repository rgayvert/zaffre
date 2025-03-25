import { atom, Box, View, Atom } from "zaffre";
import { IFrameOptions, mergeComponentOptions, afterAddedToDOM, BV, restoreOptions } from "zaffre";
import { core, defineComponentBundle } from "zaffre";
import { createYouTubePlayer, YouTubePlayerConfig, YTPlayer } from "./YouTubePlayer";

const watchingForBlur = false;
function watchForBlur(): void {
  setInterval(() => {
    if (document.activeElement instanceof HTMLIFrameElement) {
      document.activeElement.blur();
    }
  }, 1000);
}

export interface YouTubeIFrameOptions extends IFrameOptions {
  seekTime?: Atom<number>;
  controls?: boolean;
  disableKeyboard?: boolean;
  allowFullscreen?: boolean;
  blurOnFocus?: boolean;
}
defineComponentBundle<YouTubeIFrameOptions>("YouTubeIFrame", "Box", {
  controls: true,
  disableKeyboard: true,
  allowFullscreen: false,
  border: core.border.thin,
});

export function YouTubeIFrame(videoID: string, player: YTPlayer, inOptions: BV<YouTubeIFrameOptions>): View {
  const options = mergeComponentOptions("YouTubeIFrame", inOptions);

  const ready = atom(false);
  options.background = atom(() => (ready.get() ? core.color.transparent : core.color.gray));

  if (options.blurOnFocus && !watchingForBlur) {
    watchForBlur();
  }

  let boxElement: HTMLElement;
  afterAddedToDOM(options, (view: View): void => {
    boxElement = <HTMLElement>view.elt;
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

  return restoreOptions(Box(options));
}
