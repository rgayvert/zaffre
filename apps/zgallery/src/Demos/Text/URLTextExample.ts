import { URLText, em, ScrollPane, pct, zborder, zspace } from "zaffre";
import { highlightSourceText } from ":plugins";

export const URLTextExample = () => {
  return ScrollPane({ width: pct(100), height: pct(100) }).append(
    URLText("info.sample", {
      border: zborder.thin,
      padding: zspace.s4,
      height: em(12),
      overflow: "scroll",
      textTransformFn: highlightSourceText,
    })
  );
}
