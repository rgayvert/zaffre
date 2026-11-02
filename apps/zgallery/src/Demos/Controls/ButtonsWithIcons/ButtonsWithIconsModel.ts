import { atom, toggleAtom } from ":foundation";

export class ButtonsWithIconsModel {
  storeOpen = toggleAtom(true);
  result = atom("");
  iconName = "icon.shopping-cart";
};