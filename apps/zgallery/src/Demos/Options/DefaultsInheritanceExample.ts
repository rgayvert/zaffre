import { View, core, Spacer, Icon, px, Box, Stack, VStack, SoftGrid, pct, TextLabel } from "zaffre";

// Icon from https://www.svgrepo.com/svg/191464/fox

function LabeledStack(label: string, view: View): View {
  return VStack({
    border: core.border.thin,
    alignItems: "center",
    justifyItems: "end",
    height: pct(100),
    padding: core.space.s3,
  }).append(Spacer(1), view, Spacer(1), TextLabel(label));
}
const boxOptions = {
  border: core.border.thin.color(core.color.red),
  padding: core.space.s3,
};  
const stackOptions = {
  border: core.border.thin.color(core.color.red),
  padding: core.space.s3,
  gap: core.space.s3,
};
function Fox(): View {
  return Icon("icon.fox", { fontSize: px(54) });
}
function FoxInBox(): View {
  return Box(boxOptions).append(Fox());
}
function FoxOnFoxInBox(): View {
  return Box(boxOptions).append(Fox(), Fox());
}
function FoxAndFoxInStack(): View {
  return Stack(stackOptions).append(Fox(), Fox());
}
function FoxAndFoxInVStack(): View {
  return VStack(stackOptions).append(Fox(), Fox());
}

export function DefaultsInheritanceExample(): View {
  return SoftGrid({ minColumnWidth: "17ch" }).append(
    LabeledStack("Fox", Fox()),
    LabeledStack("FoxInBox", FoxInBox()),
    LabeledStack("FoxOnFoxInBox", FoxOnFoxInBox()),
    LabeledStack("FoxAndFoxInStack", FoxAndFoxInStack()),
    LabeledStack("FoxAndFoxInVStack", FoxAndFoxInVStack())
  );
}
