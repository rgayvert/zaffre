import { zget, Atom, atom, zset, isNullish, Formatter, Parser, zboolean } from ":foundation";
import { addOptionEvents, handleEvents, addClass, afterAddedToDOM } from ":core";
import { Input, InputOptions, InputType } from "../Content";

//
// GenericTextInput is a generic base component for all input components that use a
// standard Input content component. It includes a formatter and parser for converting
// between the native string value and the desired value type.
//

// TODO: use autofocus instead of firstFocus?

export interface TextInputOptions extends InputOptions {
  inputType?: InputType;
  firstFocus?: zboolean;
  setOnInput?: zboolean;
  selectOnFocus?: zboolean;
  preserveCursorLocation?: zboolean;
  outlineWhenEdited?: zboolean;
  editOnDoubleClick?: zboolean;
  keyFilter?: (key: string) => boolean;
  readOnly?: Atom<boolean>;
}

export const GenericTextInput = <T>(
  value: Atom<T | null>,
  formatter: Formatter<T>,
  parser: Parser<T>,
  inOptions: TextInputOptions,
) => {
  const options = addClass(inOptions, "GenericTextInput");
  options.model = value;
  options.type = options.inputType;
  options.maySetContent ??= true;
  options.readonly = atom(() => zget(options.disabled) || zget(options.readOnly || false));

  let cursorLocation: number | null = null;
  let inputElt: HTMLInputElement;

  // if inputElt.value resolves to the current value, leave it alone; otherwise,
  // replace it with the formatted value
  const adjustedTextValue = () => {
    const inval = inputElt ? parser(inputElt.value) : "";
    if (inval !== value.get()) {
      return formatter(value.get()) || "";
    } else {
      return inputElt ? inputElt.value : "";
    }
  };

  const textValue = atom(() => adjustedTextValue());
  textValue.options.validateValue = (v) => !isNullish(v);

  //value.options.debug = true;

  textValue.addAction((s) => {
    value.set(parser(s));
  });

  value.addAction((val) => {
    const newVal = formatter(val);
    newVal && textValue.set(newVal);
  });

  addOptionEvents(options, {
    blur: (evt: FocusEvent): void => handleBlur(evt),
    focus: (evt: FocusEvent): void => handleFocus(evt),
    keyDown: (evt: KeyboardEvent): void => handleKeyDown(evt),
    dblClick: (evt: MouseEvent): void => handleDoubleClick(evt),
    input: (evt: InputEvent): void => handleInput(evt),
    change: (evt: Event): void => handleChange(evt),
  });
  afterAddedToDOM(options, (view): void => {
    inputElt = <HTMLInputElement>view.elt;
    const viewOptions = <TextInputOptions>view.options;
    if (viewOptions.firstFocus) {
      view.focus();
    }
  });

  options.onApplyContent = (view): void => {
    const viewOptions = <TextInputOptions>view.options;
    if (viewOptions.preserveCursorLocation) {
      inputElt.selectionStart = cursorLocation;
      inputElt.selectionEnd = cursorLocation;
    }
    if (!zget(inputElt.readOnly) && viewOptions.placeholder) {
      inputElt.placeholder = zget(viewOptions.placeholder);
    }
  };

  const handleDoubleClick = (event: MouseEvent): void => {
    event.preventDefault();
    if (zget(inputElt.readOnly) && zget(options.editOnDoubleClick)) {
      zset(options.readOnly, false);
      zset(inputElt.readOnly, false);
      const len = inputElt.value.length;
      inputElt.setSelectionRange(0, len);
      handleEvents(options.events?.dblClick, event);
    }
  };
  const handleFocus = (_event: FocusEvent): void => {
    if (zget(options.selectOnFocus)) {
      inputElt.select();
    }
  };
  const setAndFire = (): void => {
    textValue instanceof Atom && textValue.setAndFire(inputElt.value);
  };
  const handleBlur = (_event: FocusEvent): void => {
    setAndFire();
    zset(options.readOnly, true);
  };
  const handleChange = (_event: Event): void => {
      setAndFire();
      zset(options.readOnly, true);
    
  };
  const handleInput = (_evt: InputEvent): void => {
      options.valid?.set(inputElt.validity.valid);
      if (zget(options.setOnInput)) {
        cursorLocation = inputElt.selectionStart;
        setAndFire();
    
    }
  };
  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Enter") {
      setAndFire();
    }
    if (options.keyFilter && !options.keyFilter(event.key)) {
      event.preventDefault();
    }
  };
  return Input(textValue, options);
};
