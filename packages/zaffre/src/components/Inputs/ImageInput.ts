import { zboolean, zstring, Atom, atom } from ":foundation";
import { addOptionEvents, px, beforeAddedToDOM, addClass } from ":core";
import { ImageBox, ImageBoxOptions, Input, InputOptions } from "../Content";
import { VStack } from "../Layout";

//
// An ImageInput is a wrapper around the standard <input type="file"> element.
// The value is a reactive array of File objects.
//

export interface ImageInputOptions extends ImageBoxOptions {
  defaultImageURL?: string;
  accept?: zstring; // image types
  onLoad?: (file: File, url: Atom<string>) => void;
  trigger?: Atom<number>;
}

interface FInputOptions extends InputOptions {
  multiple?: zboolean;
  accept?: zstring;
}

const FInput = (file: Atom<File | null>, options: FInputOptions) => {
  options.type = "file";
  options.opacity = 0;

  beforeAddedToDOM(options, (view): void => {
    const inputElt = <HTMLInputElement>view.elt;
    const viewOptions = view.options;
    addOptionEvents(viewOptions, { change: () => file.set(inputElt.files ? inputElt.files[0] : null) });
  });

  return Input(atom(""), options);
};

const defaultOnLoad = (file: File | null, url: Atom<string>) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      url.set(<string>e.target!.result);
    };
    reader.readAsDataURL(file);
  }
};
export const ImageInput = (url: Atom<string>, inOptions: ImageInputOptions = {}) => {
  const options = addClass(inOptions, "ImageInput");
  options.model = url;
  const file = atom<File | null>(null);

  const fInput = FInput(file, {
    width: px(0),
    height: px(0),
    multiple: false,
    accept: options.accept || ".jpg, .jpeg, .png, .webp",
  });
  const showPicker = () => (<HTMLInputElement>fInput.elt).showPicker();
  options.clickAction = () => showPicker();
  options.trigger?.addAction(() => showPicker());

  file.addAction((f) => {
    if (f) {
      const onLoad = options.onLoad || defaultOnLoad;
      onLoad(f, url);
    }
  });
  return VStack({ cls: "ImageInput.container" }).append(ImageBox(url, options).append(fInput));
};
