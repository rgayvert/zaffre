import { atom, Box, View, Atom, IFrameOptions, mergeComponentDefaults, afterAddedToDOM } from "zaffre";
import { core, defineComponentDefaults } from "zaffre";
import { createYouTubePlayer, YouTubePlayerConfig, YTPlayer } from "./YouTubePlayer";

export interface YouTubeIFrameOptions extends IFrameOptions {
  seekTime?: Atom<number>;
  controls?: boolean;
  disableKeyboard?: boolean;
  allowFullscreen?: boolean;
}
defineComponentDefaults<YouTubeIFrameOptions>("YouTubeIFrame", "Box", {
  controls: true,
  disableKeyboard: true,
  allowFullscreen: false,
  border: core.border.thin,
});

export function YouTubeIFrame(videoID: string, player: YTPlayer, inOptions: YouTubeIFrameOptions): View {
  const options = mergeComponentDefaults("YouTubeIFrame", inOptions);

  const ready = atom(false);
  options.background = atom(() => (ready.get() ? core.color.transparent : core.color.gray));

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

  return Box(options);
}
