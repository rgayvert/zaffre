import { Atom } from ":foundation";
import { addClass, afterOptionsMerged } from ":view";
import { HStack, StackOptions } from "../Layout";
import { Icon } from "../Content";
import { TextInput } from "../Inputs";
import { Button } from "../Controls/Button";
import { MenuButton, MenuItemList } from "../Floating";

//
// SearchBox
//

export interface SearchBoxOptions extends StackOptions {
  //contextOptions?: string[];
  contextList?: MenuItemList<string>;
}

export const SearchBox = (value: Atom<string>, inOptions: SearchBoxOptions = {}) => {
  const options = addClass(inOptions, "SearchBox");
  options.model = value;

  afterOptionsMerged(options, (view) => {
    view.append(
      Icon("icon.search"),
      TextInput(value, { 
        takeFocusWhen: options.takeFocusWhen
      }),
      Button({ 
        cls: "SearchBox.ClearButton", 
        action: () => value.set(""), 
        hidden: () => value.get() === "" 
      }),
    );
    const contextList = options.contextList;
    if (contextList) {
      view.append(MenuButton(contextList, { cls: "SearchBox.ContextMenu" }));
    }
  });
  
  return HStack(options);
};
