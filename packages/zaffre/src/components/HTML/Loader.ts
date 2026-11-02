import { Atom, atom } from ":foundation";
import { View, ViewOptions, HTML, addClass, afterAddedToDOM, HTMLOptions } from ":core";

//
// A Loader waits for a value to be retrieved. When the value is set, the Loader view
// is replaced with a new view that is created using the value.

//
// TODO:
//   - provide some feedback while the value is being retrieved
//   - display some kind of error message if the retrieval fails
//   - handle specific error conditions (missing/invalid/timeout)
//

export interface LoaderOptions extends HTMLOptions {
  delay?: number;
  timeout?: number;
  viewOptions?: ViewOptions;
  errorMessage?: string;
  beforeLoading?: () => Promise<void>;
}

export const Loader = <R>(
  value: Atom<R>,
  retrieveFn: (value: Atom<R>) => any,
  viewCreator: (value: R, options?: ViewOptions) => View,
  inOptions: LoaderOptions = {}
) => {
  const options = addClass(inOptions, "Loader");

  const errorMessage = atom("");

  const retrieve = async () => {
    if (options.beforeLoading) {
      await options.beforeLoading();
    }
    retrieveFn(value);
  }
  const replaceView = (loaderView: View): void => {
    //console.log("replaceView: loaderView="+loaderView);
    const parent = loaderView.parent;
    if (parent) {
      const loaderViewOptions = loaderView.options;
      const newView = viewCreator(value.get(), options.viewOptions);
      newView.options.id = loaderViewOptions.id;
      newView.options.hidden = loaderViewOptions.hidden;
      newView.setParent(parent);
      parent.renderChild(newView);
      parent.replaceChild(loaderView, newView);
    }
  };
  afterAddedToDOM(options, (view): void => {
    value.addAction((r) => replaceView(view));
    //retrieveFn(value);
    retrieve();
  });

  return HTML(options);
};
