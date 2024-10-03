import { zget, atom, ZType, zboolean, zstring, zset } from ":foundation";
import { transitions, beforeAddedToDOM, simpleInteractionEffects, pct, View, BV } from ":core";
import { core, defineBaseOptions, mergeComponentOptions } from ":core";
import { Button } from "../Controls";
import { ViewList, VStack } from "../Layout";
import { FloatingOptions } from "../HTML";

//
// A Menu is a vertical stack of buttons, intended for use in a floating context (although
// there's really nothing floating-specific here).
//
// TODO: add more kinds of menu behavior
//

export interface MenuOptions extends FloatingOptions {
  onSelection?: () => void;
  includeCheck?: boolean;
}

export interface MenuItem<T> {
  value: T;
  title: zstring;
  enabled?: zboolean;
  checked?: zboolean;
  iconName?: zstring;
  subitems?: MenuItem<T>[];
}
defineBaseOptions<MenuOptions>("SimpleMenu", "Box", {
  outline: core.border.none,
  rounding: core.rounding.none,
  effects: { hidden: transitions.fadeIn() },
  tabIndex: 0,
  zIndex: 999,
});

export function SimpleMenu<T>(
  selectedValue: ZType<T>,
  values: ZType<T[]>,
  titleFn: (val: T) => string,
  inOptions: BV<MenuOptions> = {}
): View {
  const options = mergeComponentOptions("SimpleMenu", inOptions);

  const items = atom(() =>
    zget(values).map((val, index) => ({
      value: val,
      title: titleFn(zget(values)[index]) || "&nbsp;",
      checked: options.includeCheck && zget(selectedValue) === val,
    }))
  );
  // TODO: get real view options in itemSelected() without beforeAddedToDOM??
  let viewOptions: MenuOptions;

  beforeAddedToDOM(options, (view: View): void => {
    viewOptions = view.options;
  });

  function itemSelected(item: MenuItem<T>): void {
    const val = zget(item.value);
    setTimeout(() => {
      zset(selectedValue, val);
      viewOptions.hidden?.set(true);
    }, 200);
  }

  const includeCheck = atom(() => zget(items).find((item) => item.checked));
  const itemIDFn = (item: MenuItem<T>): string => zget(item.title);
  const childCreatorFn = (item: MenuItem<T>, index: number): View =>
    Button({
      label: item.title,
      padding: core.space.s0,
      border: core.border.none,
      leadingIconURI: includeCheck.get() || zget(item.checked) ? "icon.check" : "",
      background: core.color.secondaryContainer,
      rounding: core.rounding.none,
      action: () => itemSelected(item),
      selected: atom(() => zget(selectedValue) === item.title),
      selectionColor: core.color.secondary,
      width: pct(100),
      effects: simpleInteractionEffects(),
    });

  return VStack({
    ...options,
    alignItems: "start",
    border: core.border.thin,
    background: core.color.secondaryContainer,
    overflow: "hidden",
  }).append(ViewList(items, itemIDFn, childCreatorFn));
}
