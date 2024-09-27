import { CounterAtom, atom } from ":foundation";
import { View, pct, HTMLOptions, core, ViewCreator } from ":core";
import { CenterBox } from "./CenterBox";
import { ViewList } from "./ViewList";

//
// A Resettable is simple wrapper component for a single component to force it to be reloaded 
// when a counter is changed. We use an array with the counter value as the data for a ViewList,
// so the list will update with a single meaningless value each time the counter is incremented.
//
// TODO: this feels like a trick; should there be some other kind of pseudocomponent that deals with this?
//

/**
 * #Resettable
 *   - 
 */
export function Resettable(componentFn: ViewCreator, counter: CounterAtom, options: HTMLOptions = {}): View {
  return CenterBox({ ...options, width: pct(100), padding: core.space.s5, componentName: "Resettable" }).append(
    ViewList(
      atom(() => [counter.get()]),
      (dataItem) => dataItem,
      (_dataItem) => componentFn()
    )
  );
}
