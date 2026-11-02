import { zget, Atom, zboolean, znumber, Condition, Interval } from ":foundation";
import { View, addClass, beforeAddedToDOM } from ":core";
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
  fluidHeight?: zboolean;
  minFluidHeight?: znumber;
  resizeWhen?: Condition;
  selectionInterval?: Atom<Interval>;
  extraLinesWhenEditing?: znumber;
}

export const TextArea = (content: Atom<string>, inOptions: TextAreaOptions = {}) => {
  const options = addClass(inOptions, "TextArea");
  options.tag = "textarea";
  options.model = content;

  if (options.fluidHeight) {
    options.overflow = "hidden";
  }

  const updateSize = (view: View): void => {
    if (options.fluidHeight) {
      view.elt.style.height = "0px";
      view.elt.style.height = Math.max(zget(options.minFluidHeight) || 0, view.elt.scrollHeight + 1) + "px";
    }
  };
  const updateSelection = (view: View): void => {
    const textAreaElt = <HTMLTextAreaElement>view.elt;
    if (view.isActiveView()) {
      const [start, end] = [textAreaElt.selectionStart, textAreaElt.selectionEnd];
      options.selectionInterval?.set({ start, end });
      view.focus();
    }
  };
  const setSelectionRange = (view: View, start: number, end: number): void => {
    const textAreaElt = <HTMLTextAreaElement>view.elt;
    if (start !== textAreaElt.selectionStart || start !== textAreaElt.selectionEnd) {
      textAreaElt.setSelectionRange(start, end);
    }
  };
  const handleInput = (view: View): void => {
    const textAreaElt = <HTMLTextAreaElement>view.elt;
    content.set(textAreaElt.value);
    updateSelection(view);
    updateSize(view);
  };
  beforeAddedToDOM(options, (view): void => {
    //const viewOptions = <TextAreaOptions>view.options;
    if (options.fluidHeight) {
      view.addInputHandler({ input: () => updateSize(view) });
      view.elt.style.overflow = "hidden";
      view.addResizeAction(() => setTimeout(() => updateSize(view), 0));
    } else {
      options.resizeWhen?.addAction(() => updateSize(view));
    }
    view.addInputHandler({ input: () => handleInput(view) });
    view.addMouseHandler({ click: () => updateSelection(view) });
    view.addGenericHandler({ select: () => updateSelection(view) });
    options.selectionInterval?.addAction((interval) => setSelectionRange(view, interval.start, interval.end));
  });

  options.onApplyContent = (view): void => {
    const textAreaElt = <HTMLTextAreaElement>view.elt;
    const viewOptions = <TextAreaOptions>view.options;
    textAreaElt.value = zget(content);
    if (viewOptions.fluidHeight) {
      setTimeout(() => updateSize(view), 0);
    }
  };

  return Box(options);
};


