import { OptionRules, ViewOptions } from "./View";

// add any new rules in rules2 into rules1

const mergeOptionRules = (rules1: OptionRules, rules2: OptionRules) => {
  const mergedRules = { ...rules1 };
  for (const k2 in rules2) {
    mergedRules[k2] = { ...rules1[k2], ...rules2[k2] };
  }
  return mergedRules;
};

export const addClass = <T extends ViewOptions>(viewOptions: T, className: string, rules?: OptionRules) => {
  const classes = viewOptions.classList || [];
  const options = classes[0] ? viewOptions : { ...viewOptions };
  options.classList ??= [];

  // append viewOptions.style to classList if present
  if (viewOptions.cls) {
    classes.unshift(...viewOptions.cls.split(" "));
  }
  classes.push(className);

  // remove any duplicates
  options.classList = [...new Set(classes)];

  if (rules) {
    options.rules = mergeOptionRules(options.rules || {}, rules);
  }

  return <T>options;
};
