import { atom, ZArray } from ":foundation";
import { ChildCreator } from ":view";
import { MenuItemList, simpleMenuItemList } from "../Floating";

export class TitledEnsembleModel<T extends string> {
  childList: MenuItemList<T>;

  constructor(
    public labels: ZArray<string>,
    public values: ZArray<T>,
    public childCreator: ChildCreator<T>,
    public initialValue: T
  ) {
    const selectedValue = atom(initialValue);
    this.childList = simpleMenuItemList(values, selectedValue, (val: any) => labels.at(values.indexOf(val)) || "");
  }
}
