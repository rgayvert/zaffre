import { zboolean, zstring, Atom, atom } from ":foundation";
import { addOptionEvents, px, beforeAddedToDOM, zspace, addClass } from ":core";
import { Input, InputOptions, TextLabel } from "../Content";
import { Button, ButtonOptions } from "../Controls";
import { HStack } from "../Layout";

//
// A FileInput is a wrapper around the standard <input type="file"> element.
// The value is a reactive array of File objects.
//

export interface FileInputOptions extends ButtonOptions {
  accept?: zstring;
  multiple?: zboolean;
  showFiles?: boolean;
  noFilesLabel?: string;
}

interface FInputOptions extends InputOptions {
  accept?: zstring;
  multiple?: zboolean;
}

const FInput = (files: Atom<File[]>, options: FInputOptions) => {
  options.type = "file";
  options.opacity = 0;
  options.multiple ??= false;

  beforeAddedToDOM(options, (view): void => {
    const inputElt = <HTMLInputElement>view.elt;
    const viewOptions = view.options;
    addOptionEvents(viewOptions, { change: () => files.set(Array.from(inputElt.files || [])) });
  });

  return Input(atom(""), options);
};

export const FileInput = (files: Atom<File[]>, inOptions: FileInputOptions = {}) => {
  const options = addClass(inOptions, "FileInput");
  options.model= files;

  const formatFileNames = (): string => {
    const fNames = files.get();
    if (fNames.length === 0) {
      return options.noFilesLabel!;
    } else if (fNames.length === 1) {
      return fNames[0].name;
    } else {
      return `${fNames[0].name} + ${fNames.length - 1} more`;
    }
  };
  const fInput = FInput(files, {
    width: px(0),
    height: px(0),
    accept: options.accept,
    multiple: options.multiple,
  });
  options.action = (): void => (<HTMLInputElement>fInput.elt).showPicker();
  if (options.showFiles) {
    const fNames = atom(() => formatFileNames());
    return HStack({ gap: zspace.s2 }).append(Button(options).append(fInput), TextLabel(fNames, { font: options.font }));
  } else {
    return Button(options).append(fInput);
  }
};
