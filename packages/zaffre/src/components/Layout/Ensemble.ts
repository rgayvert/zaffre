import { zget, atom, Atom, ZType, setAtom, RouteAtom, SetAtom } from ":foundation";
import { App, routeChanged, afterAddedToDOM, pct, ChildCreator, ChildModifier, View, VList } from ":core";
import { defineComponentDefaults, mergeComponentDefaults } from ":core";
import { Box, BoxOptions } from "../HTML";
import { ViewList } from "./ViewList";

//
// Ensembles are important organizers for collections of components. In the simplest form,
// an Ensemble controls which of a set of components is visible.
//
// An Ensemble may load all of the components initially (e.g., preloaded Carousel), or create
// each component as needs.
//
// Typically, an Ensemble will work in concert with a selection control like a SegmentedButton.
//
// TODO:
//  - implement single mode
//  - support other types of ensembles (collapsible?)
//

type EnsembleMode = "preload" | "lazy" | "single";

export interface EnsembleOptions extends BoxOptions {
  mode?: ZType<EnsembleMode>;
  childModifier?: ChildModifier<string>;
  preloadList?: string[];
  //noCache?: boolean;
}
defineComponentDefaults<EnsembleOptions>("Ensemble", "Box", {
  mode: "lazy",
  width: pct(100),
});

// TODO: add an option for validKeys, so that we can check in Router.checkEnsemble whether a path is valid

//
// Basic ensemble, controlling visibility. Each child is given a hidden atom when created.
//
export function Ensemble(
  currentKey: Atom<string>,
  childCreator: ChildCreator<string>,
  inOptions: EnsembleOptions = {}
): View {
  const options = mergeComponentDefaults("Ensemble", inOptions);
  options.model = currentKey;
  if (currentKey instanceof RouteAtom) {
    afterAddedToDOM(options, (view: View): void => {
      view.routePoint = currentKey;
      currentKey.addAction(() => routeChanged(view.findRoutePath()));
      App.instance.router.checkEnsemble(view);
    });
  }

  options.childModifier = (child: View): void => {
    child.options.hidden = atom(() => child.options.id !== currentKey.get());
  };
  const answer = Box(options).append(
    ViewEnsemble(options.preloadList || [currentKey.get()], currentKey, childCreator, options)
  );
  return answer;
}
//
// A selection ensemble ensures that only one of a set of components is selected. See RadioButtons for
// an example.
//
export function SelectionEnsemble(
  keys: ZType<string[]>,
  currentKey: Atom<string>,
  childCreator: ChildCreator<string>,
  inOptions: EnsembleOptions = {}
): VList<string> {
  const options = mergeComponentDefaults("Ensemble", inOptions);

  return ViewEnsemble(keys, currentKey, childCreator, options);
}
function addToPool(pool: SetAtom<string>, key: string): void {
  pool.add(key);
}
function ViewEnsemble(
  keys: ZType<string[]>,
  currentKey: Atom<string>,
  childCreator: ChildCreator<string>,
  inOptions: EnsembleOptions = {}
): VList<string> {
  const options = mergeComponentDefaults("Ensemble", inOptions);
  // Allow the view list data to be extended by making it a set to which gets each key is added when requested. So it typically starts
  // with a single value, then grows.
  const pool = setAtom(zget(keys) || []);
  if (options.mode === "single") {
    currentKey.addAction((key) => {
      pool.clear();
      pool.add(key);
    });
  } else {
    //currentKey.addAction((key) => pool.add(key));
    currentKey.addAction((key) => addToPool(pool, key));
  }

  return ViewList(
    pool,
    (key) => key,
    (key, index) => childCreator(key, index),
    { childModifiers: options.childModifier ? [options.childModifier] : undefined }
  );
}
