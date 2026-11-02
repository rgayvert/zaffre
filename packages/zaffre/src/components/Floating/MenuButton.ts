import { atom } from ":foundation";
import { addClass, addOptionEvents, place, PlacementOption, View, zborder, zspace } from ":core";
import { FloatingContainer } from "../HTML";
import { Button, ButtonOptions } from "../Controls";
import { Menu } from "./Menu";
import { MenuItemList } from "./MenuItem";

export interface MenuButtonOptions<T> extends ButtonOptions {
  //titleFn?: LabelFn<T>;
  initialValue?: T;
  menuPlacement?: PlacementOption;
  //itemCreator?: MenuItemCreator<T>;
  avatar?: View;
}

export const MenuButton = <T>(menuItems: MenuItemList<T>, inOptions: MenuButtonOptions<T> = {}) => {
  const options = addClass(inOptions, "MenuButton");

  const menuHidden = atom(true);
  // TODO: menuPlacement needs to be resolved after options merged
  const placement = options.menuPlacement || place["bottom"];
  //const menuItems = pickListMenuItems(pickList, options.itemCreator);
  menuItems.options.alwaysFire = true;
  options.model = menuItems;

  addOptionEvents(options, {
    focus: () => {},
    blur: () => {},
    click: () => menuHidden.set(false),
  });
  //options.action = () => menuHidden.set(false); // show the menu on a click
  if (options.avatar) {
    options.border = zborder.none;
    options.padding = zspace.none;
  }

  const button = Button(options).appendAfterMounted(
    FloatingContainer({
      hidden: menuHidden,
      clickThrough: true,
      placement: placement,
    }).append(
      Menu(menuItems, {
        cls: "MenuButton.Menu",
        hidden: menuHidden,
        //titleFn: pickList.labelFn,
      }),
    ),
  );
  if (options.avatar) {
    button.append(options.avatar);
  }
  return button;
};
