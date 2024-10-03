import {zstring, fetchTextAtom, atom, Atom } from ":foundation";
import { View, resolveURI, defineBaseOptions, mergeComponentOptions, BV } from ":core";
import { TextBox, TextBoxOptions } from "../Content";

//
// A URLText component is a simple TextBox which gets its contents from a URL.
// Note that the contents may be transformed using the textTransformFn option of TextBox.
//
// If you need to manipulate the contents after retrieval, you can pass an atom to
// get a copy of the contents.
//
// TODO: 
//   - implement loading and error messages
//

export interface URLTextOptions extends TextBoxOptions {
  errorMessage?: zstring;
  copyOfContents?: Atom<string>;
}
defineBaseOptions<URLTextOptions>("URLText", "Text", {
  errorMessage: "Failed to retrieve file",
});

export function URLText(uri: zstring, inOptions: BV<URLTextOptions> = {}): View {
  const options = mergeComponentOptions("URLText", inOptions);
  const url = atom(() => resolveURI(uri));
  const fetchAtom = fetchTextAtom(url);
  if (options.copyOfContents) {
    fetchAtom.addAction((val) => options.copyOfContents?.set(val));
  }
  return TextBox(fetchAtom, options);
}
