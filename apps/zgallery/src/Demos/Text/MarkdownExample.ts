import { em, ScrollPane, pct, zborder, zspace } from "zaffre";
import { Markdown } from "../Common";

export const MarkdownExample = () => {
  return ScrollPane({ width: pct(100), height: pct(100) }).append(
    Markdown({
      uri: "url.markdownit-examples", 
      border: zborder.thin,
      padding: zspace.s4,
      height: em(20),
    })
  );
}
