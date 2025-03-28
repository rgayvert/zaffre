import { zboolean, zstring, Atom, atom } from ":foundation";
import { View, addOptionEvents, px, beforeAddedToDOM, BV, restoreOptions } from ":core";
import { core, defineComponentBundle, mergeComponentOptions } from ":core";
import { Input, InputOptions, TextLabel } from "../Content";
import { ButtonOptions, Button } from "../Controls";
import { HStack } from "../Layout";

//
// A FileInput is a wrapper around the standard <input type="file"> element.
// The value is a reactive array of File objects.
//

interface FInputOptions extends InputOptions {
  accept?: zstring;
  multiple?: zboolean;
}
defineComponentBundle<FInputOptions>("FInput", "Input", {
  opacity: 0,
  multiple: false,
  type: "file",
});

function FInput(files: Atom<File[]>, inOptions: BV<FInputOptions> = {}): View {
  const options = mergeComponentOptions("FInput", inOptions);

  beforeAddedToDOM(options, (view: View): void => {
    const inputElt = <HTMLInputElement>view.elt;
    const viewOptions = view.options;
    addOptionEvents(viewOptions, { change: () => files.set(Array.from(inputElt.files || [])) });
  });

  return restoreOptions(Input(atom(""), options));
}

export interface FileInputOptions extends ButtonOptions {
  accept?: zstring;
  multiple?: zboolean;
  showFiles?: boolean;
  noFilesLabel?: string;
}
defineComponentBundle<FileInputOptions>("FileInput", "Button", {
  label: "Choose file",
  leadingIconURI: "icon.folder",
  background: core.color.primaryContainer,
  showFiles: true,
  noFilesLabel: "(no file)",
});

export function FileInput(fileNames: Atom<File[]>, inOptions: BV<FileInputOptions> = {}): View {
  const options = mergeComponentOptions("FileInput", inOptions);
  options.model = fileNames;

  function formatFileNames(): string {
    const fNames = fileNames.get();
    if (fNames.length === 0) {
      return options.noFilesLabel!;
    } else if (fNames.length === 1) {
      return fNames[0].name;
    } else {
      return `${fNames[0].name} + ${fNames.length - 1} more`;
    }
  }
  const fInput = FInput(fileNames, {
    width: px(0),
    height: px(0),
    accept: options.accept,
    multiple: options.multiple,
  });
  options.action = (): void => (<HTMLInputElement>fInput.elt).showPicker();
  if (options.showFiles) {
    const fNames = atom(() => formatFileNames());
    return restoreOptions(
      HStack({ gap: core.space.s2 }).append(Button(options).append(fInput), TextLabel(fNames, { font: options.font }))
    );
  } else {
    return restoreOptions(Button(options).append(fInput));
  }
}
