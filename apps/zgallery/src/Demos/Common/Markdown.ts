import { zget, em, zstring, fetchTextAtom, resolveURI, atom, Atom, inDarkMode } from "zaffre";
import { core, defineComponentDefaults, mergeComponentDefaults } from "zaffre";
import { View, TextBox, TextBoxOptions, MarkdownService } from "zaffre";

/**
 * #Markdown
 *   - simple text display of markdown content, used for demo notes
 *   - assumes that Markdown service has been installed
 *   - content is supplied either by a URI or directly as a string 
 */

export interface MarkdownOptions extends TextBoxOptions {
  markdown?: zstring;
  uri?: zstring;
  markdownStyle?: string;
  expandRelativeAssets?: boolean;
  darkModeSuffix?: string;
}
defineComponentDefaults<MarkdownOptions>("Markdown", "Box", {
  extraClasses: "markdown-body",
  background: core.color.background,
  minHeight: em(1.2),
  textTransformFn: markdownTransform,
  padding: core.space.s3,
  userSelect: "text",
  expandRelativeAssets: true,
  darkModeSuffix: "_dark"
});

function markdownTransform(s: string): string {
  return MarkdownService.defaultInstance.renderMD(s);
}
function applyDarkModeSuffix(s: zstring, suffix: string): Atom<string> {
  return atom(() => inDarkMode() ? zget(s).replaceAll("<<DM>>", suffix) : zget(s).replaceAll("<<DM>>", ""));
}

export function Markdown(inOptions: MarkdownOptions = {}): View {
  const options = mergeComponentDefaults("Markdown", inOptions);
  let mdText: zstring;
  if (options.uri) {
    let url = resolveURI(options.uri);
    if (options.expandRelativeAssets) {
      // prepend ./assets/ with the path to this file
      const path = url.split("/").slice(0, -1).join("/");
      const f = <typeof markdownTransform>options.textTransformFn;
      options.textTransformFn = (text: string) => f(text).replaceAll("./assets/", `${path}/assets/`);
    }
    mdText = url ? fetchTextAtom(url) : "";
  } else {
    mdText = zget(options.markdown || "");
  }
  if (options.darkModeSuffix) {
    return TextBox(applyDarkModeSuffix(mdText, options.darkModeSuffix), options);
  }
  return TextBox(mdText, options);
}