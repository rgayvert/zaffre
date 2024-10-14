import { zboolean, zget, Atom, atom, zstring, zset } from ":foundation";
import { View, addOptionEvents, handleEvents, beforeAddedToDOM, BV, restoreOptions } from ":core";
import { core, defineComponentBundle, mergeComponentOptions } from ":core";
import { Input, InputOptions, InputType } from "../Content";

//
// GenericTextInput is a generic base component for all input components that use a
// standard Input content component. It includes a formatter and parser for converting
// between the native string value and the desired value type.
//

export interface TextInputOptions extends InputOptions {
  firstFocus?: zboolean;
  setOnInput?: zboolean;
  selectOnFocus?: zboolean;
  preserveCursorLocation?: zboolean;
  outlineWhenEdited?: zboolean;
  editOnDoubleClick?: zboolean;
  pattern?: string;
  min?: number;
  max?: number;
  step?: string;
  autocomplete?: zstring;
}
defineComponentBundle<TextInputOptions>("TextInput", "Input", {
  font: core.font.body_medium,
  setOnInput: true,
  preserveCursorLocation: true,
});

export function GenericTextInput<T>(
  value: Atom<T>,
  inputType: InputType,
  formatter: (value: T) => string,
  parser: (text: string) => T,
  inOptions: BV<TextInputOptions> = {}
): View {
  const options = mergeComponentOptions("TextInput", inOptions);

  options.type = inputType;

  let cursorLocation: number | null = null;
  let inputElt: HTMLInputElement;

  const text = atom(formatter(value.get()));
  text.addAction((s) => {
    value.set(parser(s));
  });
  value.addAction((val) => text.set(formatter(val)));

  addOptionEvents(options, {
    blur: (evt: FocusEvent): void => handleBlur(evt),
    focus: (evt: FocusEvent): void => handleFocus(evt),
    keyDown: (evt: KeyboardEvent): void => handleKeyDown(evt),
    dblClick: (evt: MouseEvent): void => handleDoubleClick(evt),
    input: (evt: InputEvent): void => handleInput(evt),
  });
  beforeAddedToDOM(options, (view: View): void => {
    inputElt = <HTMLInputElement>view.elt;
    const viewOptions = <TextInputOptions>view.options;
    if (viewOptions.firstFocus) {
      view.focus();
    }
  });

  options.onApplyContent = (view: View): void => {
    const viewOptions = <TextInputOptions>view.options;
    if (viewOptions.preserveCursorLocation) {
      inputElt.selectionStart = cursorLocation;
      inputElt.selectionEnd = cursorLocation;
    }
    if (!inputElt.readOnly && viewOptions.placeholder) {
      inputElt.placeholder = zget(viewOptions.placeholder);
    }
  };

  function handleDoubleClick(event: MouseEvent): void {
    event.preventDefault();
    if (inputElt.readOnly && zget(options.editOnDoubleClick)) {
      zset(options.readOnly, false);
      inputElt.readOnly = false;
      const len = inputElt.value.length;
      inputElt.setSelectionRange(0, len);
      handleEvents(options.events?.dblClick, event);
    }
  }
  function handleFocus(event: FocusEvent): void {
    if (zget(options.selectOnFocus)) {
      inputElt.select();
    }
  }
  function setAndFire(): void {
    text instanceof Atom && text.setAndFire(inputElt.value);
  }
  function handleBlur(event: FocusEvent): void {
    setAndFire();
    zset(options.readOnly, true);
  }
  function handleInput(_evt: InputEvent): void {
    options.valid?.set(inputElt.validity.valid);
    if (zget(options.setOnInput)) {
      cursorLocation = inputElt.selectionStart;
      setAndFire();
    }
  }
  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      setAndFire();
    }
  }
  return restoreOptions(Input(text, options));
}
