import { zstring, fetchTextAtom, atom, Atom, resolveURI } from ":foundation";
import { addClass, afterOptionsMerged } from ":core";
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

export const URLText = (uri: zstring, inOptions: URLTextOptions = {}) => {
  const options = addClass(inOptions, "URLText");
  
  afterOptionsMerged(options, () => {
    if (options.copyOfContents) {
      fetchAtom.addAction((val) => options.copyOfContents?.set(val));
    }
  });

  const url = atom(() => resolveURI(uri));
  const fetchAtom = fetchTextAtom(url);
  return TextBox(fetchAtom, options);
};
