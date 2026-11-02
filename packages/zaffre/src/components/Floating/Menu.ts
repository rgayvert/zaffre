import { zget, atom, Atom, zset, ZArray, PickList, LabelFn } from ":foundation";
import { addClass, beforeAddedToDOM, getBodyView, } from ":core";
import { viewThatTriggeredEvent } from ":core";
import { StackOptions, ViewList, VStack } from "../Layout";
import { MenuItem, MenuItemList } from "./MenuItem";
import { FloatingContainer } from "../HTML";

//
// A Menu is a vertical stack of buttons, typicallly used in a floating context or
// as a navigation tool.
//

export interface MenuOptions<T> extends StackOptions {
  titleFn?: LabelFn<T>;
  onSelection?: () => void;
  includeCheck?: boolean;
}

export const Menu = <T>(menuItems: MenuItemList<T>, inOptions: MenuOptions<T> = {}) => {
  const options = addClass(inOptions, "Menu");
  options.model = menuItems;

  // accept a selection event event if it's the same one
  menuItems.forEach((item) => item.menuSelection = menuItems.lastSelection);

  // hide the menu when an item is selected
  const itemSelected = () => {
    //setTimeout(() => zset(viewOptions.hidden, true), 200);
    zset(options.hidden, true);
  };
  menuItems.lastSelection.addAction(() => itemSelected());

  let keyInput = atom("");
  let lastInputTime = 0;
  const handleKey = (key: string): void => {
    //console.log("handleKey: "+key);
    if (key === "Enter") {
      zset(options.hidden, true);
    } else if (key === "ArrowUp") {
    } else if (key === "ArrowDown") {
    } else {
      const now = Date.now();
      keyInput.set(now - lastInputTime > 1000 ? key : keyInput.get() + key);
      lastInputTime = now;
    }
  };

  // const itemTitleIsFirstToMatchKeyInput = (item: MenuItem<T>): boolean => {
  //   const input = keyInput.get();
  //   if (input.length === 0) {
  //     return false;
  //   } else {
  //     const firstItem = zget(items).find((item) => zget(item.getTitle()).toLowerCase().startsWith(input));
  //     const match = item.title === firstItem?.title;
  //     if (match) {
  //       selectedValue.set(item.value);
  //     }
  //     return match;
  //   }
  // };

  //const includeCheck = atom(() => zget(items).find((item) => item.checked));
  //const itemIDFn = (item: MenuItem<T>): string => zget(item.title || "");
  //const childCreatorFn = (item: MenuItem<T>, index: number) => createItemView(item, index);

  const handleBlur = (evt: Event): void => {
    const menu = viewThatTriggeredEvent(evt);
    const refView = menu?.floatingAncestor()?.referenceView;
    refView?.focus();
  };
  // const scrollOptions: ScrollPaneOptions = {
  //   overflowX: "hidden",
  //   overflowY: "auto",
  //   maxHeight: px(500),
  // };

  return VStack({
    ...options,
    events: {
      keyDown: (evt) => handleKey(evt.key),
      blur: (evt) => handleBlur(evt),
    },
  }).append(
    ViewList(
      menuItems.values,
      (item) => item.id,
      (item) => item.createView(),
      { noCache: true },
    ),
  );
};

// export type PopUpMenu<T> = {
//   pickList: PickList<T>;
//   itemCreator?: MenuItemCreator<T>;
// };

export const showMenu = <T>(menuItems: MenuItemList<T>) => {
  const hidden = atom(true, {
    action: (b) => {
      b && view.remove();
    },
  });
  //const menuItems = pickListMenuItems(menu.pickList, menu.itemCreator);

  const view = FloatingContainer({
    hidden: hidden,
    clickThrough: true,
    placement: "cursor",
  }).append(
    Menu(menuItems, {
      cls: "MenuButton.Menu",
      hidden: hidden,
      //titleFn: menu.pickList.labelFn,
    }),
  );
  getBodyView().append(view);
  hidden.set(false);
};
