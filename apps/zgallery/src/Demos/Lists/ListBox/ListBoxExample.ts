import { HStack, Button, ListBox, VStack } from "zaffre";
import { SampleListBoxModel } from "./ListBoxExample.model";
import { listBoxExampleRules } from "./ListBoxExample.rules";


export const ListBoxExample = () => {
  const model = new SampleListBoxModel();

  return HStack({ rules: listBoxExampleRules(model), cls: "container" }).append(
    ListBox(model.wordList),
    VStack({ cls: "buttons"}).append(
      Button({ cls: "add-button" }), 
      Button({ cls: "sort-button" }), 
    )
  );
};
