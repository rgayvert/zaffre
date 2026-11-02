import { TextBox, lorem, HStack, TextDisclosureList, zutil, pickList, addClass, StackOptions } from "zaffre";
import { accordionListExampleRules } from "./AccordionExample.rules";

interface DemoData {
  title: string;
  detail: string;
}
const accordionData: DemoData[] = zutil.sequence(0, 5).map((i) => ({ id: i, title: lorem.words(4), detail: lorem.sentences(20) }));
const accordionList = pickList([], accordionData, {
  labelFn: (item) => (item ? item.title : ""),
});

export const AccordionExample = (inOptions: StackOptions = {}) => {
  const options = addClass(inOptions, "accordion-list-top", accordionListExampleRules);
  options.model = accordionList;

  return HStack(options).append(
    TextDisclosureList(accordionList, (item: DemoData) => TextBox(item.detail, { cls: "accordion-text" }), {
      cls: "accordion-list",
    }),
  );
};
