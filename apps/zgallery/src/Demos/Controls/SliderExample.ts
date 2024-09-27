import { core, View, HStack, zlog, Slider, Spacer, TextLabel, atom, ch, pct } from "zaffre";

export function SliderExample(): View {
  const sliderValue = atom(50, { action: () => sliderChanged() });
  function sliderChanged(): void {
    zlog.debug(`slider value: ${sliderValue.get()}`);
  }

  return HStack({ width: pct(100) }).append(
    Slider(sliderValue, { minVal: 0, maxVal: 100, width: pct(50), radiusRatio: 50 }),
    Spacer(core.space.s3),
    TextLabel(atom(() => sliderValue.get().toFixed(0).toString()), { minWidth: ch(2)})
  );
}
