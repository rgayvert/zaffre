import { Box, em, ch, Loader, zborder, zspace, noOp } from "zaffre";
import { fetchTextAtom, HStack, resolveURI, pct, zstring } from "zaffre";
import { Markdown } from ":demos/Common";

export const LoaderExample = () => {

  const MDBox = (uri: zstring) => {
    // note: in this case the value contains the response, so the ResponseFn doesn't do anything
    const value = fetchTextAtom(resolveURI(uri), {
      valid: (val) => !val.startsWith("<!DOCTYPE"),
    });
    return Box({
      border: zborder.thin, 
      width: ch(20),
      height: em(6), 
    }).append(
      Loader(value, 
        noOp, 
        () =>
          Markdown({
            markdown: value.get(),
            height: pct(100),
          })
        )
      );
  }

  // TODO: the second box should display an error message
  return HStack({ gap: zspace.s5 }).append(MDBox("info/markdownit-examples.md"), MDBox("info/xx.md"));
}
