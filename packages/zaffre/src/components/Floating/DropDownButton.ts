import { Atom, atom, Builder, IBuilder, PickList, zboolean, zget, ztoggle } from ":foundation";
import { addClass, addOptionEvents, afterOptionsMerged, standardDropDownPlacement, View, zfont, zrounding, zspace } from ":core";
import { FloatingContainer } from "../HTML";
import { Button, ButtonOptions } from "../Controls";
import { HStack } from "../Layout";
import { Icon } from "../Content";
import { MenuItemList } from "./MenuItem";
import { Menu, MenuOptions } from "./Menu";

//
// TODO: DropDownMenu = Button + Menu
//
//

// A DropDownMenu is a button with an associated menu that will appear when the
// button is clicked, and hide when a selection is made. By default, the title will
// be the value of the current selection. A client of this view will send in a
// selectedValue to which an action has been attached, which will act as the callback.
//
// TODO:
//  - allow title to be fixed
//  - use initialValue
//

export interface DropDownButtonOptions<T> extends ButtonOptions {
  initialValue?: T;
  minWidthFromReference?: boolean;
  onDialog?: boolean;
  newAction?: (pickList: MenuItemList<T>) => void;
}

export const DropDownButton = <T>(menuItems: MenuItemList<T>, inOptions: DropDownButtonOptions<T> = {}) => {
  const menuHidden = atom(true);
  const disabled = atom(inOptions.disabled || false);
  menuItems.options.alwaysFire = true;
  const options = addClass(inOptions, "DropDownButton");
  options.model = menuItems;
  //const menuItems = pickList.values;

  afterOptionsMerged(options,  (view) => {
    //const menuItems = pickListMenuItems(pickList);
    options.model ??= menuItems;
    // prevent the menu from being opened again on a button click when the menu is showing
    menuHidden.options.debounce = 100;

    if (options.onDialog) {
      menuItems.forEach((item) => item.menuSelection);
    }

    addOptionEvents(options, {
      focus: () => {},
      blur: () => {},
    });
    options.action = () => ztoggle(menuHidden);

    const menuOptions: MenuOptions<T> = {
      font: zfont.inherit,
      rounding: zrounding.none,
      hidden: menuHidden,
    };

    view.append(
      FloatingContainer({
        hidden: menuHidden,
        clickThrough: true,
        placement: standardDropDownPlacement,
      }).append(Menu(menuItems, menuOptions)),
    );
  });

  options.trailingIconURI = () => (disabled.get() ? "" : menuHidden.get() ? "icon.chevron-down" : "icon.chevron-up");
  options.label = atom(() => menuItems.selectedLabel());

  if (options.newAction) {
    return HStack({ gap: zspace.s3 }).append(
      Button(options),
      Icon("icon.add-circle", {
        controlSize: "lg",
        clickAction: () => options.newAction!(menuItems),
      }),
    );
  } else {
    return Button(options);
  }
};

// interface DropDownSpec<T> extends DropDownButtonOptions<T> {
//   menuItemList: MenuItemList<T>
// }
// class DropDownSpec<T> implements DropDownButtonOptions<T>  {
//   createView(): View {
//     return DropDownButton(this.menuItemList, this);
//   }
// }
// export const dropDownButtonSpec = <T>(name: string, value: Atom<T | null>, menuItemList: MenuItemList<T>): IBuilder<DropDownSpec<T>> => {
//   menuItemList.lastSelection.addAction((mi) => mi && value.set(mi.value || null));
//   menuItemList.labelFn = (item) => item && zget(item.getTitle()) || "";
//   return Builder(DropDownSpec<T>);
// };


