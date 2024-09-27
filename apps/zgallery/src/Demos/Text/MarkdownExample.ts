import { View, core, em, ScrollPane, pct } from "zaffre";
import { Markdown } from "../Common";

export function MarkdownExample(): View {
  return ScrollPane({ width: pct(100), height: pct(100) }).append(
    Markdown({
      uri: "url.markdownit-examples", 
      border: core.border.thin,
      padding: core.space.s4,
      height: em(20),
    })
  );
}
