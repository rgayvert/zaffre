import { TextBox, lorem, HStack, pickList, addClass } from "zaffre";
import { TextDisclosureList, zutil } from "zaffre";
import { disclosureListExampleRules } from "./DisclosureListExample.rules";

interface DemoData {
  title: string;
  detail: string;
}
const disclosureData: DemoData[] = zutil.sequence(0, 5).map((i) => ({ id: i, title: lorem.words(4), detail: lorem.sentences(20) }));

const disclosureList = pickList([], disclosureData, {
  labelFn: (item) => (item ? item.title : ""),
});

export const DisclosureListExample = () => {
  const options = addClass({}, "disclosure-list-top", disclosureListExampleRules);
  return HStack(options).append(
    TextDisclosureList(disclosureList, (item) => TextBox(item.detail, { cls: "disclosure-text" }), {
      cls: "disclosure-list",
    }),
  );
};
