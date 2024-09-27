import { core, View, HStack, zlog, RadioButtons, atom, Spacer, TextLabel, ch } from "zaffre";

export function RadioButtonExample(): View {
  const radioValue1 = atom("");
  const radioValue2 = atom("");
  const result = atom(() => `Value 1: ${radioValue1.get()}<br>Value 2: ${radioValue2.get()}`);

  return HStack({ gap: core.space.s8 }).append(
    RadioButtons(radioValue1, ["A", "B"], ["Option A", "Option B"], { gap: core.space.s3, labelBoxOptions: { font: core.font.title_medium } }),
    RadioButtons(radioValue2, ["D", "E", "F"], ["DDD", "EEE", "FFF"], {
      flexDirection: "row",
      labelBoxOptions: {
        side: "bottom",
        color: core.color.tertiary,
      },
      radioButtonOptions: {
        onIcon: "icon.square-box-filled",
        offIcon: "icon.square-box-outlined",
      }
    }),
    Spacer(core.space.s7),
    TextLabel(result, { padding: core.space.s2, font: core.font.body_small, minWidth: ch(18) }),
  );
}
 