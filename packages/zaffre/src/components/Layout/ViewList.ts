import { Atom, zget, ZType } from ":foundation";
import { View, VList, ChildCreator, ChildDataIDFn, VListOptions } from ":core";
import { TextLabel, TextLabelOptions } from "../Content";

//
// A ViewList is a pseudocomponent that provides reactive changes to the DOM.
//

export function ViewList<T>(
  data: ZType<Iterable<T>>,
  childDataID: ChildDataIDFn<T>,
  childCreator: ChildCreator<T>,
  options?: VListOptions<T>
): VList<T> {
  return new VList(data, childDataID, childCreator, options);
}

export function TextLabelList(
  labels: ZType<string[]>,
  textLabelOptionsFn: (dataItem: string, index: number) => TextLabelOptions
): VList<string> {
  return ViewList(
    labels,
    (dataItem) => zget(dataItem),
    (dataItem, index) => TextLabel(dataItem, textLabelOptionsFn(dataItem, index))
  );
}

export function SimpleViewList(items: Atom<View[]>): VList<View> {
  return ViewList(
    items,
    (item: View) => item.options.id,
    (item, _index) => item
  );
}
