import { CounterAtom, atom } from ":foundation";
import { pct, HTMLOptions, ViewCreator, zspace, addClass } from ":core";
import { CenterBox } from "./CenterBox";
import { ViewList } from "./ViewList";
import { BoxOptions } from "../HTML";

//
// A Resettable is simple wrapper component for a single component to force it to be reloaded
// when a counter is changed. We use an array with the counter value as the data for a ViewList,
// so the list will update with a single meaningless value each time the counter is incremented.
//
// TODO: this feels like a trick; should there be some other kind of pseudocomponent that deals with this?
//

export interface ResettableOptions extends BoxOptions {}

export const Resettable = (componentFn: ViewCreator, counter: CounterAtom, inOptions: HTMLOptions = {}) => {

  const options = addClass(inOptions, "Resettable");

  return CenterBox({ ...options, width: pct(100), padding: zspace.s5, name: "Resettable" }).append(
    ViewList(
      atom(() => [counter.get()]),
      (dataItem) => dataItem,
      (_dataItem) => componentFn()
    )
  );
}
