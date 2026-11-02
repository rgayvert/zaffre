import { SearchBox, TextLabel, atom, Grid, simpleMenuItemList } from "zaffre";
import { searchBoxExampleRules } from "./SearchBoxExample.rules";

export const SearchBoxExample = () => {
  const searchValue = atom("");
  const selectedContext = atom("local");
  const contextList = simpleMenuItemList(["local", "global"], selectedContext);
  const label = atom(() => searchValue.get() === "" ? "" : `Searching for '${searchValue.get()}'`);

  return Grid({ rules: searchBoxExampleRules(contextList), cls: "search-example-top" }).append(
    SearchBox(searchValue, { 
      contextList: contextList, 
    }),
    TextLabel(label)
  );
}
