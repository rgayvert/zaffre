import { zget, Atom, ZType, setAtom, SetAtom, atom, BasicAction } from ":foundation";
import { RouteAtom, afterAddedToDOM, ChildCreator, ViewCreator, View, ChildModifier, routeToPath } from ":core";
import { VList, addClass, addRouteNode, getRoutePath } from ":core";
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

// TODO: add an option for validKeys, so that we can check in Router.checkEnsemble whether a path is valid

//
// Basic ensemble, controlling visibility. Each child is given a hidden atom when created.
//

type EnsembleMode = "preload" | "lazy" | "single";

export interface EnsembleOptions<T extends string> extends BoxOptions {
  mode?: ZType<EnsembleMode>;
  childModifier?: ChildModifier<T>;
  preloadList?: T[];
  reloadList?: T[];
  onInvalidKey?: ViewCreator;
}

export type EnsembleViewCreator = ViewCreator | ((match?: string) => View);

// TODO: for map-based approach (instead of case)
export type EnsembleMap<T extends string> = Map<T, EnsembleViewCreator | string>;

export const createEnsembleMap = <T extends string>(entries: [string, EnsembleViewCreator][]) => new Map<string, EnsembleViewCreator>(entries);

// TODO: extend this to N parameters

const extractParametersFromKey = (pattern: string, key: string) => {
  try {
    const regex = new RegExp(pattern);
    const result = key.match(regex);
    if (result) {
      if (result[2]) {
        return [result[1], result[2].slice(1)];
      } else {
        return [result[1]];
      }
    } else {
      return undefined;
    }
  } catch (e) {
    return undefined;
  }
};

export const MappedEnsemble = <T extends string>(currentKey: Atom<T>, map: EnsembleMap<T>, inOptions: EnsembleOptions<T> = {}) => {
  const routeOrCreateView = (key: T) => {
    const val = map.get(key);
    if (typeof val === "string") {
      routeToPath(val);
      return Box();
    }
    if (val) {
      return val();
    } else {
      // try regexp: find matching key
      for (const k of map.keys()) {
        const params = extractParametersFromKey(k, key);
        if (params) {
          const fn = <EnsembleViewCreator>map.get(k)!;
          return fn(...params);
        }
      }
      if (inOptions.onInvalidKey) {
        return inOptions.onInvalidKey();
      } else {
        return Box();
      }
    }
  };
  return Ensemble(currentKey, (key) => routeOrCreateView(key), inOptions);
};

export const RoutingEnsemble = <T extends string>(currentKey: RouteAtom<T>, map: EnsembleMap<T>, options: EnsembleOptions<T> = {}) => {
  afterAddedToDOM(options, (view): void => {
    addRouteNode(currentKey);
  });
  options.onIntersectionVisible = () => {
    // check route path
    const routePath = getRoutePath();
    console.log("checking route path: " + routePath);
    console.log("base path: " + currentKey.basePath);
    if (currentKey.basePath) {
      const rest = routePath.slice(currentKey.basePath.length);
      //console.log("rest=" + (rest.startsWith("/") ? rest.slice(1) : rest));
      currentKey.set(<T>(rest.startsWith("/") ? rest.slice(1) : rest));
    }
  };

  return MappedEnsemble(currentKey, map, options);
};

export const Ensemble = <T extends string>(currentKey: Atom<T | null>, childCreator: ChildCreator<T>, inOptions: EnsembleOptions<T> = {}) => {
  const options = addClass(inOptions, "Ensemble");
  options.model ??= currentKey;

  options.childModifier = (child: View): void => {
    child.options.hidden = () => child.options.id !== currentKey.get();
  };
  const defaultKeys = currentKey.get() ? [currentKey.get()!] : [];
  return Box(options).append(ViewEnsemble(options.preloadList || defaultKeys, currentKey, childCreator, options));
};

const addToPool = (pool: SetAtom<string>, newKey: string, previousKey: string, reloadList: string[]): void => {
  if (reloadList.includes(previousKey)) {
    pool.delete(previousKey);
  }
  pool.add(newKey);
};

const ViewEnsemble = <T extends string>(
  keys: ZType<T[]>,
  currentKey: Atom<T> | Atom<T | null>,
  childCreator: ChildCreator<T>,
  inOptions: EnsembleOptions<T> = {},
): VList<T> => {
  // Allow the view list data to be extended by making it a set to which gets each key is added when requested. So it typically starts
  // with a single value, then grows.
  const pool = setAtom(zget(keys) || []);
  currentKey.options.onReset = () => pool.clear();

  // TODO: this doesn't get applied, since the ensemble Box gets the options
  const options = addClass(inOptions, "ViewEnsemble");
  options.model = [currentKey, pool]; 

  const reloadList = options.reloadList || [];

  if (options.mode === "single") {
    currentKey.addAction((key) => {
      pool.clear();
      key && pool.add(key);
    });
  } else {
    currentKey.addAction((key) => key && addToPool(pool, key, currentKey.previousVal || "", reloadList));
  }

  return ViewList(
    pool,
    (key) => key,
    (key, index) => childCreator(key, index),
    {
      childModifiers: options.childModifier ? [options.childModifier] : undefined,
      //noCache: options.mode === "single",
      //debug: zget(currentKey.options.debug)
    },
  );
};

//
// A selection ensemble ensures that only one of a set of components is selected. See RadioGroup for
// an example.
//
export const SelectionEnsemble = <T extends string>(
  keys: ZType<T[]>,
  currentKey: Atom<T>,
  childCreator: ChildCreator<T>,
  options: EnsembleOptions<T> = {},
): VList<T> => {
  return ViewEnsemble(keys, currentKey, childCreator, options);
};

//////////////////////////////////////////////////////////////

// export type EnsembleViewCreators<T extends string> = {
//   [key in T]: ViewCreator;
// }
export type EnsembleViewCreators<T extends string> = Record<T, ViewCreator>;

export const FixedEnsemble = <T extends string>(currentKey: Atom<T>, creators: EnsembleViewCreators<T>, options: EnsembleOptions<T> = {}) => {
  return Ensemble(currentKey, (key) => creators[key as T](), options);
};

export class SimpleEnsembleSet {
  constructor() {}
  selectedKey = atom("");
  views = new Map<string, View>([]);
  getViewForKey(key: string): View {
    return this.views.get(key) || Box();
  }
  add(key: string, view: View): void {
    this.views.set(key, view);
    this.selectedKey.set(key);
  }
  at(key: string): View {
    return this.views.get(key) || Box();
  }
  select(key: string): void {
    this.selectedKey.set(key);
  }
}

type ToggleBoxKey = "0" | "1";

export const ToggleBox = (key: Atom<boolean>, viewFn0: ViewCreator, viewFn1: ViewCreator, inOptions: EnsembleOptions<ToggleBoxKey> = {}) => {
  const options = addClass(inOptions, "ToggleBox");
  options.model = key;

  const selectedKey = atom<ToggleBoxKey>(() => (key.get() ? "1" : "0"));
  const toggleChildCreator = (key: ToggleBoxKey) => {
    return key === "1" ? viewFn1() : viewFn0();
  };
  return Ensemble(selectedKey, toggleChildCreator, options);
};
