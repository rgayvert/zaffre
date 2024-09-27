import { View, core, URLText, em, ScrollPane, pct } from "zaffre";
import { highlightSourceText } from ":services";

export function URLTextExample(): View {
  return ScrollPane({ width: pct(100), height: pct(100) }).append(
    URLText("info.sample", {
      border: core.border.thin,
      padding: core.space.s4,
      height: em(12),
      overflow: "scroll",
      textTransformFn: highlightSourceText,
    })
  );
}
