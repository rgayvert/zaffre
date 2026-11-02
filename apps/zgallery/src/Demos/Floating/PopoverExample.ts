import { Box, Button, FloatingContainer, HStack, TextLabel, atom,em, place, zborder, zcolor, zfont, zspace } from "zaffre";

export const PopoverExample = () => {
  const popover1Hidden = atom(true);
  const popover2Hidden = atom(true);

  const SamplePopover = (text: string) => {
    return Box({ background: zcolor.lightgray, border: zborder.thin }).append(
      TextLabel(`Popover text: ${text}`, { font: zfont.label_medium })
    );
  }
  return HStack({ gap: em(2) }).append(
    Button({ label: "Click to show popover", action: () => popover1Hidden.set(false) }).append(
      FloatingContainer({ hidden: popover1Hidden, placement: place.left }).append(SamplePopover("1"))
    ),
    Box({
      border: zborder.thin,
      events: {
        pointerOver: () => popover2Hidden.set(false),
      },
    }).append(
      TextLabel("Hover to show popover", { padding: zspace.s2 }),
      FloatingContainer({ hidden: popover2Hidden, placement: place.right }).append(SamplePopover("2"))
    )
  );
}
