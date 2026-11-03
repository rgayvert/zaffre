import { timerAtom, StackOptions, pct, ch, DownButton, zfont, zrounding, zspace } from "zaffre";
import { HStack, Spacer, TextLabel, VStack, atom,px, zutil } from "zaffre";
import { ytPlayer, YouTubeIFrame, YouTubeIFrameOptions } from ":plugins";

export const YouTubeExample = () => {
  const player = ytPlayer();
  const currentTime = timerAtom(() => player.getCurrentTime(), 500, { runImmediately: true });
  const currentTimeString = atom(() => zutil.formatSeconds(currentTime.get()));
  const videoURL = "p53X66_NVEg";

  const ArrowButton = (label: string, deltaT: number) => {
    return DownButton({
      rounding: zrounding.pill,
      // _label: {
      //   padding: px(0), 
      // },
      label: label,
      downAction: () => player.seek(deltaT),
    });
  }
  const VideoButtons = () => {
    const buttonSpecs: [string, number][] = [
      ["<<<", -10],
      ["<<", -5],
      ["<", -1],
      [">", 1],
      [">>", 5],
      [">>>", 10],
    ];
    return HStack({ gap: zspace.s4, width: pct(100) }).append(
      TextLabel(currentTimeString, { font: zfont.label_large }),
      Spacer(1),
      ...buttonSpecs.map(([label, deltaT]) => ArrowButton(label, deltaT)),
      Spacer(1),
      Spacer(ch(8))
    );
  }
  const topOptions: StackOptions = {
    gap: zspace.s6,
    height: px(800),
    outline: "none",
    alignItems: "start",
    events: {
      keyBindings: {
        "Space": () => player.toggle(),
      },
    },
  };
  const videoOptions: YouTubeIFrameOptions = {
    width: px(800),
    height: px(450),
    controls: false,
  };

  return HStack(topOptions).append(
    VStack().append(YouTubeIFrame(videoURL, player, videoOptions), Spacer("s5"), VideoButtons())
  );
}
