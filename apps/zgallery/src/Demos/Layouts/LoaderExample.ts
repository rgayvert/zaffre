import { core, View, Box, em, ch, Loader } from "zaffre";
import { fetchTextAtom, HStack, resolveURI, pct, zstring } from "zaffre";
import { Markdown } from ":demos/Common";

export function LoaderExample(): View {
  function MDBox(uri: zstring): View {
    // note: in this case the value contains the response, so the ResponseFn doesn't do anything
    const value = fetchTextAtom(resolveURI(uri), {
      valid: (val) => !val.startsWith("<!DOCTYPE"),
    });
    return Box({
      border: core.border.thin, 
      width: ch(20),
      height: em(6), 
    }).append(
      Loader(
        value, 
        () => value.response,
        () =>
          Markdown({
            markdown: value.get(),
            height: pct(100),
          })
      )
    );
  }

  return HStack({ gap: core.space.s5 }).append(MDBox("info/markdownit-examples.md"), MDBox("info/xx.md"));
}
