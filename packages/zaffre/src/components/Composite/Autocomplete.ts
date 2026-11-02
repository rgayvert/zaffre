import { atom, Atom, PickList, MatchAtom, LabelFn, toggleAtomValue } from ":foundation";
import { standardDropDownPlacement } from ":uifoundation";
import { addClass, afterOptionsMerged } from ":view";
import { HStack, StackOptions } from "../Layout";
import { TextInput } from "../Inputs";
import { Button } from "../Controls";
import { FloatingContainer } from "../HTML";
import { ListBox } from "./ListBox";

export interface AutocompleteOptions<T> extends StackOptions {
  labelFn?: LabelFn<T>;
}

export const Autocomplete = <T>(input: Atom<string>, list: PickList<T>, inOptions: AutocompleteOptions<T> = {}) => {
  const matches = new MatchAtom(input, list);
  const listHidden = atom(true);
  input.addAction((val) => listHidden.set(val.length === 0 || !!list.selection));

  const options = addClass(inOptions, "Autocomplete");
  options.model = matches;

  afterOptionsMerged(options, (view) => {
    const listBox = FloatingContainer({
      hidden: listHidden,
      clickThrough: true,
      elevation: 0,
      placement: standardDropDownPlacement,
    }).append(ListBox(list));

    view.append(
      TextInput(input, { cls: "Autocomplete.Input" }),
      Button({
        cls: "Autocomplete.Close",
        visibility: () => (input.get() === "" ? "hidden" : "visible"),
        action: () => input.set(""),
      }),
      Button({
        cls: "Autocomplete.Toggle",
        action: () => toggleAtomValue(listHidden),
      }),
      listBox,
    );
  });

  return HStack(options);
};
