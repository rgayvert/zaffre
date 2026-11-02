import { Atom, atom, toggleAtom, ztoggle } from ":foundation";
import { addClass, addOptionEvents, afterOptionsMerged, standardDropDownPlacement, zfont, zrounding } from ":core";
import { ButtonOptions } from "../Controls";
import { TextInput } from "../Inputs";
import { MenuItemList, MenuOptions } from "../Floating";
import { FloatingContainer } from "../HTML";
import { Menu } from "../Floating/Menu";
import { HStack } from "../Layout";
import { Icon } from "../Content";

//
// TODO: ComboBox = Button + Menu
//
//

// A ComboBox is a button with an associated menu that will appear when the
// button is clicked, and hide when a selection is made. By default, the title will
// be the value of the current selection. A client of this view will send in a
// selectedValue to which an action has been attached, which will act as the callback.
//
// TODO:
//  - allow title to be fixed
//  - use initialValue
//

export interface ComboBoxOptions<T> extends ButtonOptions {
  //labelFn?: LabelFn<T>;
  initialValue?: T;
  minWidthFromReference?: boolean;
  onDialog?: boolean;
}

export const ComboBox = <T>(
  value: Atom<string>,
  menuItems: MenuItemList<T>,
  inOptions: ComboBoxOptions<T> = {},
) => {
  const menuHidden = toggleAtom(true);
  const disabled = atom(inOptions.disabled || false);
  //pickList.options.alwaysFire = true;
  const options = addClass(inOptions, "ComboBox");
  options.model = [value, menuItems];

  afterOptionsMerged(options, (view) => {
    //const menuItems = pickListMenuItems(pickList);
    //options.model ??= pickList;
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

  options.clickAction = () => menuHidden.toggle();
  options.trailingIconURI = () => (disabled.get() ? "" : menuHidden.get() ? "icon.chevron-down" : "icon.chevron-up");

  return HStack(options).append(
    TextInput(value, { cls: "ComboBox.Input" }),
    Icon("icon.chevron-down", { cls: "ComboBox.Icon" }),
  );
};
