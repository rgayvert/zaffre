import { zget, zboolean, zstring, Atom, ZType, Interval } from ":foundation";
import { t, View, addOptionEvents, setInnerHTML, css_textAlign, beforeAddedToDOM, BV, restoreOptions } from ":core";
import { core, defineComponentBundle, mergeComponentOptions } from ":core";
import { Box, BoxOptions, TextRange, getSelectionInterval, insertTextAtCursor, setSelectionInterval } from "../HTML";

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
  textTransformFn?: ZType<TextTransformFn>;
  textAlign?: css_textAlign;
  selection?: ZType<TextRange>;
  plainTextOnly?: boolean;
  pastePlainText?: boolean;
  plainText?: Atom<string>;
  autoScrollToBottom?: zboolean;
}
defineComponentBundle<TextBoxOptions>("Text", "Box", {
  font: core.font.body_medium,
  color: core.color.primary,
  background: core.color.inherit,
  editable: false,
  spellcheck: true,
  pastePlainText: false,
  cursor: "auto",
  outline: core.border.none,
  userSelect: "text",
  display: "block",
  overflow: "auto",
});

export function TextBox(content: zstring, inOptions: BV<TextBoxOptions> = {}): View {
  const options = mergeComponentOptions("Text", inOptions);
  if (options.editable) {
    options.contentEditable = zget(options.plainTextOnly) ? "plaintext-only" : true;
  }
  options.model = content;
  const userSelect = zget(options.userSelect);
  let selection: Interval | undefined = undefined;

  options.onGetContent = (): string => zget(content);

  beforeAddedToDOM(options, (view: View): void => {
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

  options.onApplyContent = (view: View): void => {
    let textContent = zget(content);
    const htmlElt = <HTMLElement>view.elt;
    const transform = zget(options.textTransformFn);
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

  return restoreOptions(Box(options));
}
