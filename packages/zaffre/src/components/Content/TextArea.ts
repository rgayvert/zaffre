import { zget, zboolean, Atom, Condition, znumber, Interval } from ":foundation";
import { BV, View, beforeAddedToDOM, core, defineComponentBundle, mergeComponentOptions, restoreOptions } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// TextArea - editable text content using an HTML <textarea> element.
//
// In addition to the normal <textarea> behavior, we add options for "fluid" sizing.
//
// TODO:
//  - support more of textarea features
//  - is resizeWhen useful?
//

export interface TextAreaOptions extends BoxOptions {
  autocomplete?: "on" | "off";
  autocorrect?: "on" | "off";
  editable?: zboolean;
  spellcheck?: zboolean;
  fluidHeight?: zboolean;
  minFluidHeight?: znumber;
  resizeWhen?: Condition;
  selectionInterval?: Atom<Interval>;
  extraLinesWhenEditing?: znumber;
}
defineComponentBundle<TextAreaOptions>("TextArea", "Box", {
  tag: "textarea",
  background: core.color.background,
  spellcheck: true,
  resize: "auto",
  cursor: "auto",
  outline: core.border.none,
  userSelect: "auto",
  display: "block",
});

export function TextArea(content: Atom<string>, inOptions: BV<TextAreaOptions> = {}): View {
  const options = mergeComponentOptions("TextArea", inOptions);

  function updateSize(view: View): void {
    if (options.fluidHeight) {
      view.elt.style.height = "0px";
      view.elt.style.height = Math.max(zget(options.minFluidHeight) || 0, view.elt.scrollHeight + 1) + "px";
    }
  }
  function updateSelection(view: View): void {
    const textAreaElt = <HTMLTextAreaElement>view.elt;
    if (view.isActiveView()) {
      const [start, end] = [textAreaElt.selectionStart, textAreaElt.selectionEnd];
      options.selectionInterval?.set({ start, end });
      view.focus();
    }
  }
  function setSelectionRange(view: View, start: number, end: number): void {
    const textAreaElt = <HTMLTextAreaElement>view.elt;
    if (start !== textAreaElt.selectionStart || start !== textAreaElt.selectionEnd) {
      textAreaElt.setSelectionRange(start, end);
    }
  }
  function handleInput(view: View): void {
    const textAreaElt = <HTMLTextAreaElement>view.elt;
    content.set(textAreaElt.value);
    updateSelection(view);
  }
  beforeAddedToDOM(options, (view: View): void => {
    const viewOptions = <TextAreaOptions>view.options;
    if (options.fluidHeight) {
      view.addInputHandler({ input: () => updateSize(view) });
      view.elt.style.overflow = "hidden";
      view.addResizeAction(() => setTimeout(() => updateSize(view), 0));
    } else {
      viewOptions.resizeWhen?.addAction(() => updateSize(view));
    }
    view.addInputHandler({ input: () => handleInput(view) });
    view.addMouseHandler({ click: () => updateSelection(view) });
    view.addGenericHandler({ select: () => updateSelection(view) });
    viewOptions.selectionInterval?.addAction((interval) => setSelectionRange(view, interval.start, interval.end));
  });

  options.onGetContent = (): string => zget(content);
  options.onApplyContent = (view: View): void => {
    const textAreaElt = <HTMLTextAreaElement>view.elt;
    const viewOptions = <TextAreaOptions>view.options;
    textAreaElt.value = zget(content);
    if (viewOptions.fluidHeight) {
      setTimeout(() => updateSize(view), 0);
    }
  };

  return restoreOptions(Box(options));
}
