import { Atom, ZType } from ":foundation";
import { View, VList, ChildCreator, ChildDataIDFn, VListOptions } from ":core";

//
// A ViewList is a pseudocomponent that provides reactive changes to the DOM.
//

export const ViewList = <T>(
  data: ZType<Iterable<T>>,
  childDataID: ChildDataIDFn<T>,
  childCreator: ChildCreator<T>,
  options?: VListOptions<T>
): VList<T> => {
  return new VList(data, childDataID, childCreator, options);
}

export const SimpleViewList = (items: Atom<View[]>): VList<View> => {
  return ViewList(
    items,
    (item: View) => item.options.id,
    (item, _index) => item
  );
}

export const Defer = (fn: () => View) => {
  return ViewList([], (x) => x, (x) => fn());
}