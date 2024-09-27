import { core, View, HStack, zlog, atom, SegmentedButton, Spacer, TextLabel, ch } from "zaffre";

export function SegmentedButtonExample(): View {
  const segmentSelected = atom("B");
  const result = atom(() => `Selection: ${segmentSelected.get()}`)

  return HStack({ gap: core.space.s4 }).append(
    SegmentedButton(segmentSelected, ["A", "B", "C", "D"], { 
      labels: ["Option A", "Option B", "Option C", "Option D"],
      font: core.font.title_small,
      disabledValues: atom(() => segmentSelected.get() === "A" ? ["D"] : []),
    }),
    Spacer(core.space.s7),
    TextLabel(result, { padding: core.space.s2, font: core.font.body_small, minWidth: ch(18) }),
  
  );
}
