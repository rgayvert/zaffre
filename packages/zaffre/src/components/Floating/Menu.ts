import { zget, atom, ZType, zboolean, zstring, Atom, condition, BasicAction } from ":foundation";
import { beforeAddedToDOM, simpleInteractionEffects, pct, View, restoreOptions, em } from ":core";
import { px, BV, core, defineComponentBundle, mergeComponentOptions, viewThatTriggeredEvent } from ":core";
import { Button } from "../Controls";
import { ScrollPane, ViewList, VStack } from "../Layout";
import { Box, FloatingOptions } from "../HTML";

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
  value?: T | undefined;
  title?: zstring;
  enabled?: zboolean;
  checked?: zboolean;
  separator?: boolean;
  iconName?: zstring;
  subitems?: MenuItem<T>[];
  action?: BasicAction;
  keystroke?: string;
}
defineComponentBundle<MenuOptions>("SimpleMenu", "Box", {
  outline: core.border.none,
  rounding: core.rounding.none,
  //effects: { hidden: transitions.fadeIn("in", 0.1) },
  tabIndex: 0,
  zIndex: 999,
});

export function SimpleMenu<T>(
  selectedValue: Atom<T | undefined>,
  values: ZType<Iterable<T>>,
  titleFn: (val: T, index?: number) => string,
  inOptions: BV<MenuOptions> = {}
): View {
  const options = mergeComponentOptions("SimpleMenu", inOptions);

  const items = atom(() =>
    Array.from(zget(values)).map((val, index) => ({
      value: val,
      title: titleFn(val, index),
      checked: options.includeCheck && selectedValue.get() === val,
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
      selectedValue.set(val);
      viewOptions.hidden?.set(true);
    }, 200);
  }

  let keyInput = atom("");
  let lastInputTime = 0;
  function handleKey(key: string): void {
    //console.log("handleKey: "+key);
    if (key === "Enter") {
      viewOptions.hidden?.set(true);
    } else if (key === "ArrowUp") {
    } else if (key === "ArrowDown") {
    } else {
      const now = Date.now();
      keyInput.set(now - lastInputTime > 1000 ? key : keyInput.get() + key);
      lastInputTime = now;
    }
  }

  function itemTitleIsFirstToMatchKeyInput(item: MenuItem<T>): boolean {
    const input = keyInput.get();
    if (input.length === 0) {
      return false;
    } else {
      const firstItem = items.get().find((item) => item.title.toLowerCase().startsWith(input));
      const match = item.title === firstItem?.title;
      if (match) {
        selectedValue.set(item.value);
      }
      return match;
    }
  }
  function createItemView(item: MenuItem<T>, index: number): View {
    if (zget(item.title) === "") {
      return Box({
        //width: pct(95),
        height: px(1),
        //padding: em(0.1),
        background: core.color.secondaryContainer,
        border: core.border.thin
      })
    } else {
      return Button({
        label: item.title,
        controlSize: "xs",
        justifyContent: "start",
        padding: core.space.s0,
        paddingInline: core.space.s1,
        border: core.border.none,
        leadingIconURI: includeCheck.get() || zget(item.checked) ? "icon.check" : "",
        background: core.color.secondaryContainer,
        rounding: core.rounding.none,
        action: () => itemSelected(item),
        selectionColor: core.color.secondary,
        width: pct(100),
        effects: simpleInteractionEffects(),
        scrollToTopWhen: condition(() => itemTitleIsFirstToMatchKeyInput(item)),
      });
    }
  }

  const includeCheck = atom(() => zget(items).find((item) => item.checked));
  const itemIDFn = (item: MenuItem<T>): string => zget(item.title || "");
  const childCreatorFn = (item: MenuItem<T>, index: number): View => createItemView(item, index);

  function handleBlur(evt: Event): void {
    const menu = viewThatTriggeredEvent(evt);
    const refView = menu?.floatingParent()?.referenceView;
    refView?.focus();
  }

  return restoreOptions(
    VStack({
      ...options,
      alignItems: "start",
      border: core.border.thin,
      background: core.color.secondaryContainer,
      events: {
        keyDown: (evt) => handleKey(evt.key),
        blur: (evt) => handleBlur(evt),
      },
    }).append(ScrollPane({ maxHeight: px(500), width: pct(100) }).append(ViewList(items, itemIDFn, childCreatorFn)))
  );
}
