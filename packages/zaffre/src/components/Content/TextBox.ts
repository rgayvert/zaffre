import { zget, zstring, Atom, Interval, avget, AtomOrValue, zboolean, ZType } from ":foundation";
import { t, addOptionEvents, setInnerHTML, beforeAddedToDOM, addClass, css_textAlign, afterOptionsMerged } from ":core";
import { Box, BoxOptions, getSelectionInterval, insertTextAtCursor, setSelectionInterval, TextRange } from "../HTML";

//
// A box containing plain text or HTML. The most notable element here is the textTransformFn,
// which will be applied whenever the content changes. This is useful for doing things like
// highlighting and markdown conversion.
//

export type TextTransformFn = (text: string) => string;

export interface TextBoxOptions extends BoxOptions {
  editable?: zboolean;
  spellcheck?: zboolean;
  sanitize?: zboolean;
  textTransformFn?: AtomOrValue<TextTransformFn>;
  textAlign?: css_textAlign;
  selection?: ZType<TextRange>;
  plainTextOnly?: boolean;
  pastePlainText?: boolean;
  plainText?: Atom<string>;
  autoScrollToBottom?: zboolean;
  readOnly?: Atom<boolean>;
}

export const TextBox = (content: zstring, inOptions: TextBoxOptions = {}) => {
  const options = addClass(inOptions, "TextBox");
  options.model = content;

  afterOptionsMerged(options, () => {
    if (options.editable) {
      options.contentEditable = zget(options.plainTextOnly) ? "plaintext-only" : true;
    }
    if (options.editable && content instanceof Atom) {
      addOptionEvents(options, {
        input: (evt: InputEvent) => {
          selection = getSelectionInterval(<HTMLElement>evt.target);
          if (content instanceof Atom) {
            const elt = <HTMLElement>evt.target;
            options.plainText?.set(elt.innerText || "");
            // update the content but skip the reaction
            content.set(options.plainTextOnly ? elt.innerText : elt.innerHTML, true);
          }
        },
      });
    }
  });
  
  let selection: Interval | undefined = undefined;

  beforeAddedToDOM(options, (view): void => {
    const userSelect = zget(options.userSelect);

    const htmlElt = <HTMLElement>view.elt;
    if (options.pastePlainText) {
      view.addEventListener("paste", (evt: Event) => {
        evt.preventDefault();
        const text = (<ClipboardEvent>evt).clipboardData?.getData("text/plain");
        text && insertTextAtCursor(text);
      });
    }
    if (userSelect === "auto" || userSelect === "text") {
      view.addEventListener("mouseup", (evt: Event) => {
        selection = getSelectionInterval(htmlElt);
      });
      view.addEventListener("keyup", (evt: Event) => {
        const sel = getSelectionInterval(htmlElt);
        let { start, end } = sel;
        if ((<KeyboardEvent>evt).key === "Enter") {
          // enter key causes a new div to be added
          if (start < htmlElt.innerText.length - 2) {
            start++;
            end++;
          }
        }
        selection = { start, end };
        setSelectionInterval(htmlElt, selection);
      });
    }
  });

  options.onApplyContent = (view): void => {
    let textContent = zget(content || "");
    const htmlElt = <HTMLElement>view.elt;
    const transform = avget(options.textTransformFn);
    if (textContent && transform) {
      textContent = transform(textContent);
    }
    if (zget(options.plainTextOnly)) {
      htmlElt.innerText = textContent;
    } else {
      setInnerHTML(view, t(textContent));
    }
    options.plainText?.setValue(htmlElt.innerText);
    selection && setSelectionInterval(htmlElt, selection);
    if (options.autoScrollToBottom) {
      htmlElt.scrollTop = htmlElt.scrollHeight;
    }
  };

  return Box(options);
};

