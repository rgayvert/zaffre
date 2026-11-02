import { atom, zget, zstring, fetchTextAtom, avget, resolveURI, addClass, TextBoxOptions } from "zaffre";
import { inDarkMode, linkPathPrefix, TextBox, MarkdownService } from "zaffre";

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
  markdownStyle?: string; // ???
}

export const Markdown = (inOptions: MarkdownOptions = {}) => {
  const options = addClass(inOptions, "Markdown")

  let mdText: zstring;
  if (options.uri) {
    let url = resolveURI(options.uri);
    if (options.expandRelativeAssets) {
      // prepend ./assets/ with the path to this file
      const path = url.split("/").slice(0, -1).join("/");
      const f = avget(options.textTransformFn)!;
      options.textTransformFn = (text: string) => {
        const s = text.replaceAll("./assets/", `${path}/assets/`).replaceAll("<<LINK_PREFIX>>", linkPathPrefix());
        return f(s);
      };
    }
    mdText = url ? fetchTextAtom(url) : "";
  } else {
    mdText = zget(options.markdown || "");
  }

  const fixDarkModeAndLinkBase = (s: zstring, darkModeSuffix: string) => {
    return atom(() =>
      inDarkMode()
        ? zget(s).replaceAll("<<DARK_MODE_SUFFIX>>", darkModeSuffix)
        : zget(s).replaceAll("<<DARK_MODE_SUFFIX>>", "")
    );
  }

  options.textTransformFn = (s: string) => MarkdownService.defaultInstance.renderMD(s || "");

  return options.darkModeSuffix
    ? TextBox(fixDarkModeAndLinkBase(mdText, options.darkModeSuffix), options)
    : TextBox(mdText, options);
}
