import { IBuilder, Builder, ZArray, pickOne, atom, arrayAtom, isNullish, nullish } from ":foundation";
import { PickList, LabelFn, Atom, zstring, BasicAction, zboolean, zget } from ":foundation";
import { interactionEffect, standardHTMLInteractionEffects, textInteractionEffect } from ":effect";
import { zfont } from ":theme";
import { View } from ":view";
import { Button } from "../Controls";
import { Box } from "../HTML";

export type MenuItemList<T> = PickList<MenuItem<T>>;

export interface MenuItemListOptions<T> {
  titleFn?: LabelFn<T>;
}

const setMenuItemSelections = <T>(menuList: MenuItemList<T>) => {
  menuList.values.forEach((item) => (item.menuSelection = menuList.lastSelection));
};

const evalLabelFn = <T>( value: T | nullish, labelFn?: LabelFn<T>) => {
  return isNullish(value) || !labelFn ? "" : labelFn?.(value) || "";
}

export const simpleMenuItemList = <T>(items: ZArray<T>, selection: Atom<T | null>, labelFn?: LabelFn<T>) => {
  const itemArray = arrayAtom(items);
  const menuItems = itemArray.derive((item) =>
    menuItem<T>({ value: item, titleFn: (item) => evalLabelFn(item, labelFn) }),
  );
  const selectedItem = atom<MenuItem<T> | null>(menuItems.find((item) => item.value === selection.get()) || null);
  selectedItem.addAction((mi) => mi && selection.set(mi.value || null));
  const menuList = pickOne(selectedItem, menuItems, { alwaysFire: true });
  // connect the items to the list, and update when the list changes
  setMenuItemSelections(menuList);
  menuItems.addAction(() => {
    setMenuItemSelections(menuList);
    selectedItem.set(menuItems.find((item) => item.value === selection.get()) || null);
  });
  return menuList;
};

export const menuItemList = <T>(items: IMenuItem<T>[], selection: Atom<T | null>) => {
  const itemArray = arrayAtom(items);
  const menuItems = itemArray.derive((item) => menuItem(item));
  const selectedItem = atom<MenuItem<T> | null>(menuItems.find((item) => item.value === selection.get()) || null);
  selectedItem.addAction((mi) => mi && selection.set(mi.value || null));
  const menuList = pickOne<MenuItem<T>>(selectedItem, menuItems, {
    labelFn: (item) => (item && item.title) || "",
    alwaysFire: true,
  });
  // connect the items to the list, and update when the list changes
  setMenuItemSelections(menuList);
  menuItems.addAction(() => {
    setMenuItemSelections(menuList);
    selectedItem.set(menuItems.find((item) => item.value === selection.get()) || null);
  });
  return menuList;
};

export interface IMenuItem<T> {
  value?: T | null;
  title?: string;
  titleFn?: LabelFn<T>;
  iconName?: zstring;
  action?: BasicAction;
  disabled?: Atom<boolean>;
  checked?: zboolean;
  separator?: boolean;
  keystroke?: string;
  subitems?: MenuItem<T>[];
  menuSelection?: Atom<MenuItem<T> | null>;
}

export interface MenuItem<T> extends IMenuItem<T> {}

export class MenuItem<T> implements IMenuItem<T> {
  static _nextID = 1;
  static nextID(): number {
    return this._nextID++;
  }
  id: number;
  //value: T;
  constructor() {
    this.id = MenuItem.nextID();
  }

  toString(): string {
    return zget(this.getTitle());
  }

  getTitle(): zstring {
    return this.titleFn ? this.titleFn(this.value) : this.title || "";
  }
  getIconName(): zstring {
    return this.iconName || "";
  }
  hasIcon(): boolean {
    return Boolean(this.getIconName() || this.checked);
  }
  isSeparator(): boolean {
    return !!this.separator;
  }
  isChecked(): boolean {
    return !!zget(this.checked);
  }
  handleAction(): void {
    if (this.subitems) {
      // show submenu
    } else {
      this.menuSelection?.set(this);
      this.action?.();
    }
  }

  createSeparator(): View {
    return Box({ cls: "Menu.Separator" });
  }
  createButton(): View {
    // TODO: this always creates an Icon whether we really need one or not; perhaps we should
    // add a "hasIcon" attribute?
    const icon = this.hasIcon()
      ? () => zget(this.getIconName()) || (zget(this.isChecked()) ? "icon.check" : "")
      : undefined;
    return Button({
      cls: "Menu.Item",
      font: zfont.inherit,
      label: this.getTitle(),
      leadingIconURI: icon,
      disabled: this.disabled,
      model: this,
      action: () => this.handleAction(),
      effects: {
        ...standardHTMLInteractionEffects(),
        disabled: textInteractionEffect("disabled", 0.1),
        hovered: interactionEffect("hovered", 0, 0.2),
      },
      //scrollToTopWhen: condition(() => itemTitleIsFirstToMatchKeyInput(item)),
    });
  }
  createView(): View {
    return this.isSeparator() ? this.createSeparator() : this.createButton();
  }
}
export type MenuItemBuilder<T> = IBuilder<MenuItem<T>>;

export const menuItem = <T>(item: IMenuItem<T>): MenuItem<T> => {
  return Builder(MenuItem<T>)
    .value(item.value)
    .title(item.title)
    .titleFn(item.titleFn)
    .iconName(item.iconName)
    .action(item.action)
    .disabled(item.disabled)
    .checked(item.checked)
    .separator(item.separator)
    .keystroke(item.keystroke)
    .build();
};

//export type MenuItemCreator<T> = (item: T) => MenuItemBuilder<T>;
// Create a list of simple menu items from a PickList
// export const pickListMenuItems = <T>(
//   pickList: PickList<T>,
//   itemCreator?: MenuItemCreator<T>,
// ): ArrayAtom<MenuItem<T>> => {
//   pickList.options.alwaysFire = true;
//   itemCreator ??= <T>(item: T) => menuItem(item);

//   return pickList.values.deriveArray((array) =>
//     array.map((val) => itemCreator(val).titleFn(pickList.labelFn).menuSelection(pickList.lastSelection).build()),
//   );
// };
