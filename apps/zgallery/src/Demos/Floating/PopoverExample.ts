import { Box, Floating, HStack, TextLabel, View, core, em, place } from "zaffre";

export function PopoverExample(): View {
  function SamplePopover(): View {
    return Box({ background: core.color.background, padding: core.space.s2 }).append(
      TextLabel("Popover text", { background: core.color.background })
    );
  }
  return HStack().append(
    Box({ border: core.border.thin, rounding: core.rounding.r2, padding: core.space.s1 })
      .append(TextLabel("Click to show popover", { padding: core.space.s2 }))
      .append(Floating(SamplePopover(), { placement: place.top })),
    Box({ width: em(2) }),
    Box({ border: core.border.thin, rounding: core.rounding.r2, padding: core.space.s1 })
      .append(TextLabel("Hover to show popover", { padding: core.space.s2 }))
      .append(Floating(SamplePopover(), { showOnReferenceHover: true, placement: place.top }))
  );
}
