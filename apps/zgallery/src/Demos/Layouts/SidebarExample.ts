import { core, View, TextLabel, Sidebar, TextBox, lorem, Box, px } from "zaffre";

export function SidebarExample(): View {
  return Box({ border: core.border.thin, width: px(300), resize: "both" }).append(
    Sidebar({ gap: core.space.s6, padding: core.space.s3 }).append(
      TextLabel(lorem.words(2)),
      TextBox(lorem.words(16), { overflow: "hidden" })
    )
  );
}
