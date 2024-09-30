import { zutil } from ":foundation";
import { ComponentDefaultsMap, LocalDefaults, View, ViewCreator, ViewOptions } from ":view";

//
// Management of component defaults. 
//

const baseDefaults: ComponentDefaultsMap = new Map<string, ViewOptions>();
const defaultsStack: ComponentDefaultsMap[] = [baseDefaults];

export function currentDefaults(): ComponentDefaultsMap {
  return defaultsStack.at(-1)!;
}

// Each component may define default values for its options. These ae merged in the component function 
// with incoming options. A component may also have localDefaults, which specify defaults for decendents.

export function defineComponentDefaults<T extends ViewOptions>(
  componentName: string,
  parentComponent: string,
  options: T
): T {
  options.componentName = componentName;
  const opts = mergeComponentDefaults(parentComponent, options);
  baseDefaults.set(componentName, opts);
  return opts;
}

export function mergeOptions<T extends ViewOptions>(options1: T, options2: T): T {
  return Object.assign({ ...options1 }, options2);
}

export function localDefaultsFor(compName: string): LocalDefaults {
  let answer: LocalDefaults = {};
  localDefaultsStack.toReversed().forEach((def) => {
    if (def[compName]) {
      answer = zutil.mergeOptions(answer, def[compName]);
    }
  });
  return answer;
}

//
//  mergeComponentDefaults() should be called at the beginning of a reusable component function
//
export function mergeComponentDefaults<T extends ViewOptions>(componentName: string, inOptions: T): T {
  let defaults = currentDefaults().get(componentName) || {};
  const localDefaults = localDefaultsFor(componentName);
  if (localDefaults) {
    defaults = zutil.mergeOptions(defaults, localDefaults);
  }
  defaults.events && inOptions.events && Object.assign(defaults.events, inOptions.events);
  defaults.effects && inOptions.effects && Object.assign(defaults.effects, inOptions.effects);
  defaults.extraVars && inOptions.extraVars && defaults.extraVars.push(...inOptions.extraVars);
  defaults.animations && inOptions.animations && defaults.animations.push(...inOptions.animations);

  return <T>zutil.mergeOptions(defaults, inOptions);
}

const localDefaultsStack: LocalDefaults[] = [];

export function evaluateWithLocalDefaults(localDefaults: LocalDefaults, fn: ViewCreator): View {
  localDefaultsStack.push(localDefaults);
  const view = fn();
  localDefaultsStack.pop();
  return view;
}
