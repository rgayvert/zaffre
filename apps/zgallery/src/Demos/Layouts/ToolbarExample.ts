import { core, View, Box, px, Toolbar, Button, em, ch, zlog } from "zaffre";

export function ToolbarExample(): View {
  const icons = ["icon.bold", "icon.italic", "icon.unordered-list", "icon.numbered-list", "icon.quote"];

  return Box({
    border: core.border.thin,
    width: ch(40),
    height: em(6),
    minWidth: ch(4),
    minHeight: em(3),
    resize: "both",
  }).append(
    Toolbar({ gap: px(1) }).append(
      ...icons.map((iconName) =>
        Button({
          leadingIconURI: iconName,
          action: () => zlog.info(iconName),
          border: core.border.none,
          tooltip: iconName,
        })
      )
    )
  );
}
