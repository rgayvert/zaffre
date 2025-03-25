import { zget, em, zstring, fetchTextAtom } from "zaffre";
import { resolveURI, atom } from "zaffre";
import { Atom, inDarkMode, linkPathPrefix, BV, restoreOptions } from "zaffre";
import { core, defineComponentBundle, mergeComponentOptions } from "zaffre";
import { View, TextBox, TextBoxOptions, MarkdownService } from "zaffre";

/**
 * Markdown
 *   - simple text display of markdown content, used for demo notes
 *   - assumes that Markdown service has been installed
 *   - content is supplied either by a URI or directly as a string
 */

export interface MarkdownOptions extends TextBoxOptions {
  markdown?: zstring;
  uri?: zstring;
  expandRelativeAssets?: boolean;
  darkModeSuffix?: string;
  markdownStyle?: string;              // ???
}
defineComponentBundle("Markdown", "Box", {
  extraClasses: "markdown-body",
  background: core.color.background,
  minHeight: em(1.2),
  textTransformFn: markdownTransform,
  padding: core.space.s3,
  userSelect: "text",
  expandRelativeAssets: true,
  darkModeSuffix: "_dark",
});

function markdownTransform(s: string): string {
  return MarkdownService.defaultInstance.renderMD(s);
}
function fixDarkModeAndLinkBase(s: zstring, darkModeSuffix: string): Atom<string> {
  return atom(() =>
    inDarkMode()
      ? zget(s).replaceAll("<<DARK_MODE_SUFFIX>>", darkModeSuffix)
      : zget(s).replaceAll("<<DARK_MODE_SUFFIX>>", "")
  );
}

export function Markdown(inOptions: BV<MarkdownOptions> = {}): View {
  const options = mergeComponentOptions("Markdown", inOptions);
  let mdText: zstring;
  if (options.uri) {
    let url = resolveURI(options.uri);
    if (options.expandRelativeAssets) {
      // prepend ./assets/ with the path to this file
      const path = url.split("/").slice(0, -1).join("/");
      const f = zget(options.textTransformFn)!;
      options.textTransformFn = (text: string) => {
        const s = text.replaceAll("./assets/", `${path}/assets/`).replaceAll("<<LINK_PREFIX>>", linkPathPrefix());
        return f(s);
      };
    }
    mdText = url ? fetchTextAtom(url) : "";
  } else {
    mdText = zget(options.markdown || "");
  }
  return restoreOptions(
    options.darkModeSuffix
      ? TextBox(fixDarkModeAndLinkBase(mdText, options.darkModeSuffix), options)
      : TextBox(mdText, options)
  );
}
