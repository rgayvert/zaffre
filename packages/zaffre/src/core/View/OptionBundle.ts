import { zutil } from ":foundation";
import { BV, OptionSheet, View, ViewCreator, ViewOptions, VList } from "./View";

//
// Option bundle: an index type of non-reactive component options, analogous to a CSS class.
// OptionSheet: an index type where the keys are bundle/component names and the values
//  are option bundles.
//

export const allSheets: OptionSheet[] = [];
export function createOptionSheet(sheet: OptionSheet): OptionSheet {
  allSheets.push(sheet);
  return sheet;
}

export const baseSheet = createOptionSheet({});
export const sheetStack: OptionSheet[] = [baseSheet];
export const sheetRestoreStack: number[] = [];

export function defineBundle<T extends ViewOptions>(optionName: string, value: T, sheet = baseSheet): void {
  sheet[optionName] = value;
}


// Each component should have a base bundle. These are merged here with the parent component bundle.

export function defineComponentBundle<T extends ViewOptions>(
  componentName: string,
  parentComponent: string,
  options: T
): void {
  options.componentName = componentName;
  baseSheet[componentName] = mergeOptions(baseSheet[parentComponent], options);
}

// simple merge
function mergeOptions<T extends ViewOptions>(options1: T, options2: T): T {
  return Object.assign({ ...options1 }, options2);
}

export function pushSheets(sheets: OptionSheet[]): void {
  sheetStack.push(...sheets);
  sheetRestoreStack.push(sheets.length);
  sheets.length > 0 && console.log("pushSheets: sheetStack=" + sheetStack.length);
}
//
// Merge the base options for the given componentName with the incoming options. If the options include
// bundles, merge these as well (just after the base options).
//
//  1. Normalize inOptions.bundles to [<ComponentName>, ...other bundles ]
//  2. Push inOptions.sheets onto the sheet stack
//  3. Merge: for each bundle, descend sheet stack and merge sheet values for that bundle
//
export function mergeComponentOptions<T extends ViewOptions>(componentName: string, inOptions: BV<T>): T {
  const opts: ViewOptions =
    typeof inOptions === "string"
      ? { bundles: [inOptions] }
      : Array.isArray(inOptions)
      ? { bundles: inOptions }
      : inOptions;
  if (!opts.bundles?.includes(componentName)) {
    opts.bundles = [componentName, ...(opts.bundles || [])];
  }
  // note: these are popped in restoreOptions()
  pushSheets(opts.sheets || []);

  let result = {};
  (opts.bundles || []).forEach((bv) => {
    sheetStack.forEach((sheet) => {
      const vals = typeof bv === "string" ? sheet[bv] : bv;
      if (vals) {
        result = zutil.mergeOptions(result, vals);
      }
    });
  });
  opts.bundles = [];
  return <T>zutil.mergeOptions(result, opts);
}

export function restoreOptions(view: View): View {
  const n = sheetRestoreStack.pop() || 0;
  for (let i = 0; i < n; i++) {
    sheetStack.pop();
  }
  n > 0 && console.log("restore: sheetStack=" + sheetStack.length);
  return view;
}

export function restoreVListOptions<T>(vList: VList<T>): VList<T> {
  const n = sheetRestoreStack.pop() || 0;
  for (let i = 0; i < n; i++) {
    sheetStack.pop();
  }
  n > 0 && console.log("restore: sheetStack=" + sheetStack.length);
  return vList;
}

export function createWithOptionSheets(sheets: OptionSheet[], creator: ViewCreator): View {
  pushSheets(sheets);
  return restoreOptions(creator());
}


