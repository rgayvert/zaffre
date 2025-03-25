import { Atom, atom, ResponseAtom, ResponseFn } from ":foundation";
import { View, pct, beforeAddedToDOM, BV, restoreOptions, ViewOptions, ViewCreator } from ":core";
import { core, defineComponentBundle, mergeComponentOptions } from ":core";
import { BoxOptions } from "./Box";
import { CenterBox } from "../Layout";
import { TextLabel } from "../Content";

//
// A Loader waits for a value to be retrieved. When the value is set, the Loader view
// is replaced with a new view that is created using the value.

//
// TODO:
//   - provide some feedback while the value is being retrieved
//   - display some kind of error message if the retrieval fails
//   - handle specific error conditions (missing/invalid/timeout)
//

export interface LoaderOptions extends BoxOptions {
  delay?: number;
  timeout?: number;
  viewOptions?: ViewOptions;
  errorMessage?: string;
}
defineComponentBundle<LoaderOptions>("Loader", "Box", {
  timeout: 2000,
  width: pct(100), 
  height: pct(100),
  background: core.color.secondaryContainer,
  viewOptions: {},
  errorMessage: "Retrieval failed",
});


export function Loader<R>(
  value: Atom<R>,
  responseFn: ResponseFn,
  viewCreator: (value: R, options?: ViewOptions) => View,
  inOptions: BV<LoaderOptions> = {}
): View {
  const options = mergeComponentOptions("Loader", inOptions);
  const errorMessage = atom("");

  function replaceView(loaderView: View): void {
    const loaderViewOptions = loaderView.options;
    const newView = viewCreator(value.get(), options.viewOptions);
    newView.options.id = loaderViewOptions.id;
    newView.options.hidden = loaderViewOptions.hidden;
    newView.setParent(loaderView.parent);
    loaderView.parent?.renderChild(newView);
    loaderView.parent?.replaceChild(loaderView, newView);
  }
  function responseResolved(response: ResponseAtom, loaderView: View): void {
    if (response.ok) {
      try {
        replaceView(loaderView);
      } catch (e) {
        errorMessage.set(`Error in replaceView: ${e}`);
      }
    } else {
        const msg = response.timedOut ? "Request timed out" : response.errorMessage || "Request failed";
        errorMessage.set(msg);
    }
  }

  beforeAddedToDOM(options, (view: View): void => {
    const response = responseFn(value);
    response.addAction(() => responseResolved(response, view));
  });

  return restoreOptions(CenterBox(options).append(TextLabel(errorMessage)));
}
