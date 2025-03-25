import { zget, atom, Atom, ZType, setAtom, RouteAtom, SetAtom } from ":foundation";
import { routeChanged, afterAddedToDOM, pct, ChildCreator, ChildModifier } from ":core";
import { View, VList, BV, restoreOptions, restoreVListOptions } from ":core";
import { defineComponentBundle, mergeComponentOptions } from ":core";
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
  reloadList?: string[];
}
defineComponentBundle<EnsembleOptions>("Ensemble", "Box", {
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
  inOptions: BV<EnsembleOptions> = {}
): View {
  const options = mergeComponentOptions("Ensemble", inOptions);
  options.model ??= currentKey;
  if (currentKey instanceof RouteAtom) {
    afterAddedToDOM(options, (view: View): void => {
      view.routePoint = currentKey;
      currentKey.addAction(() => routeChanged(view.fullRoutePath()));
    });
  }

  options.childModifier = (child: View): void => {
    child.options.hidden = atom(() => child.options.id !== currentKey.get());
  };
  return restoreOptions(
    Box(options).append(ViewEnsemble(options.preloadList || [currentKey.get()], currentKey, childCreator, options))
  );
}
//
// A selection ensemble ensures that only one of a set of components is selected. See RadioButtons for
// an example.
//
export function SelectionEnsemble(
  keys: ZType<string[]>,
  currentKey: Atom<string>,
  childCreator: ChildCreator<string>,
  inOptions: BV<EnsembleOptions> = {}
): VList<string> {
  const options = mergeComponentOptions("Ensemble", inOptions);

  return restoreVListOptions(ViewEnsemble(keys, currentKey, childCreator, options));
}
function addToPool(pool: SetAtom<string>, newKey: string, previousKey: string, reloadList: string[]): void {
  if (reloadList.includes(previousKey)) {
    pool.delete(previousKey);
  }
  pool.add(newKey);
}
function ViewEnsemble(
  keys: ZType<string[]>,
  currentKey: Atom<string>,
  childCreator: ChildCreator<string>,
  inOptions: BV<EnsembleOptions> = {}
): VList<string> {
  const options = mergeComponentOptions("Ensemble", inOptions);
  // Allow the view list data to be extended by making it a set to which gets each key is added when requested. So it typically starts
  // with a single value, then grows.
  const pool = setAtom(zget(keys) || []);
  const reloadList = options.reloadList || [];

  if (options.mode === "single") {
    currentKey.addAction((key) => {
      pool.clear();
      pool.add(key);
    });
  } else {
    currentKey.addAction((key) => addToPool(pool, key, currentKey.previousVal || "", reloadList));
  }

  return restoreVListOptions(
    ViewList(
      pool,
      (key) => key,
      (key, index) => childCreator(key, index),
      { childModifiers: options.childModifier ? [options.childModifier] : undefined }
    )
  );
}
