import { HStack, Spacer, TextLabel, timerAtom, StackOptions, pct, ch, DownButton } from "zaffre";
import { VStack, View, atom, core, px, zutil } from "zaffre";
import { ytPlayer, YouTubeIFrame, YouTubeIFrameOptions } from ":services";

export function YouTubeExample(): View {
  const player = ytPlayer();
  const currentTime = timerAtom(() => player.getCurrentTime(), 500, { runImmediately: true });
  const currentTimeString = atom(() => zutil.formatSeconds(currentTime.get()));
  const videoURL = "p53X66_NVEg";

  function ArrowButton(label: string, deltaT: number): View {
    return DownButton({
      rounding: core.rounding.pill,
      labelOptions: {
        padding: px(0),
      },
      label: label,
      downAction: () => player.seek(deltaT),
    });
  }
  function VideoButtons(): View {
    const buttonSpecs: [string, number][] = [
      ["<<<", -10],
      ["<<", -5],
      ["<", -1],
      [">", 1],
      [">>", 5],
      [">>>", 10],
    ];
    return HStack({ gap: core.space.s4, width: pct(100) }).append(
      TextLabel(currentTimeString, { font: core.font.label_large }),
      Spacer(1),
      ...buttonSpecs.map(([label, deltaT]) => ArrowButton(label, deltaT)),
      Spacer(1),
      Spacer(ch(8))
    );
  }
  const topOptions: StackOptions = {
    gap: core.space.s6,
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
    VStack().append(YouTubeIFrame(videoURL, player, videoOptions), Spacer(core.space.s5), VideoButtons())
  );
}
