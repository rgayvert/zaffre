import { View, HStack, Box, defineBundle, BoxOptions, core, ch, pct } from "zaffre";

defineBundle<BoxOptions>("medium-gap", {
  gap: core.space.s5,
});
defineBundle<BoxOptions>("small-box", {
  width: ch(6),
  height: ch(6),
});
defineBundle<BoxOptions>("blue-box", {
  background: core.color.red,
});
defineBundle<BoxOptions>("green-circle", {
  background: core.color.green,
  rounding: pct(50),
}); 


export function OptionBundlesExample(): View {
  return HStack("medium-gap").append(
    Box(["small-box", "blue-box"]),
    Box(["small-box", "green-circle"]),
  );
}
 