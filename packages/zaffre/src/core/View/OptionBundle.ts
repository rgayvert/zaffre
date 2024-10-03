import { zutil } from ":foundation";
import { BV, ViewOptions } from "./View";

//
// Option bundle: a named collection of non-reactive component options, analogous to a CSS class.
//
// Each reusable component has an option bundle whose name is derived from the component name;
// e.g., "TextLabel" => "_text_label". These are created by defineBaseOptions().
//
// TODO:
//  - should these be organized into sheets? Not clear if this is needed, so we'll start simple.
//  - should list of bundles be reactive?
//  - the notion of wrapping the creation of a component to set local options might make more
//    sense at a higher level (e.g., panel)
//  - or maybe we have a wrapper like Scoped<creator, sheets> that translates to 
//          evalWithSheets(sheets, () => creator())
//
//  

export const allOptionBundles: Map<string, any> = new Map();

export function getOptionBundle<T extends ViewOptions>(bundleName: string): T {
  return allOptionBundles.get(bundleName) || {};
}

export function defineOptionBundles(rules: [string, any][]): void {
  rules.forEach(([bundleName, options]) => allOptionBundles.set(bundleName, options));
}

export function componentOptionBundleName(componentName: string): string {
  return `_${zutil.camelToSnakeCase(componentName)}`;
}
function optionsForComponent<T extends ViewOptions>(componentName: string): T {
  return getOptionBundle(componentOptionBundleName(componentName)) || {};
}

// Each component should have a base option bundle. These are merged here with the parent component bundle.

export function defineBaseOptions<T extends ViewOptions>(
  componentName: string,
  parentComponent: string,
  options: T
): void {
  options.componentName = componentName;
  const bundleName = componentOptionBundleName(componentName);
  const opts = mergeOptions(optionsForComponent(parentComponent), options);
  allOptionBundles.set(bundleName, opts);
}

// simple merge
function mergeOptions<T extends ViewOptions>(options1: T, options2: T): T {
  return Object.assign({ ...options1 }, options2);
}
//
// Merge the base options for the given componentName with the incoming options. If the options include
// bundles, merge these as well (just after the base options).
//
export function mergeComponentOptions<T extends ViewOptions>(componentName: string, inOptions: BV<T>): T {
  let options = { ...optionsForComponent(componentName) };
  const opts: ViewOptions =
    typeof inOptions === "string"
      ? { bundles: [inOptions] }
      : Array.isArray(inOptions)
      ? { bundles: inOptions }
      : inOptions;
  (opts.bundles || []).forEach((bundleName) => (options = zutil.mergeOptions(options, getOptionBundle(bundleName))));
  return <T>zutil.mergeOptions(options, opts);
}
