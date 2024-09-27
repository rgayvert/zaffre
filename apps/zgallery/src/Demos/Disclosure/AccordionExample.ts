import { core, View, TextBox, lorem, HStack, ch, SimpleDisclosureList, zutil, Atom, atom } from "zaffre";

interface DemoData {
  title: string;
  detail: string;
}
const accordionData: DemoData[] = zutil
  .sequence(0, 5)
  .map((i) => ({ id: i, title: lorem.words(4), detail: lorem.sentences(20) }));
const selectedDisclosureItem: Atom<DemoData | undefined> = atom(undefined);

export function AccordionExample(): View {
  function DisclosureDetail(dataItem: DemoData): View {
    return TextBox(dataItem.detail, {
      padding: core.space.s3,
      borderTop: core.border.thin,
      overflow: "hidden",
    });
  }

  return HStack({ padding: core.space.s5 }).append(
    SimpleDisclosureList(
      accordionData,
      selectedDisclosureItem,
      (dataItem) => dataItem.title,
      (dataItem) => DisclosureDetail(dataItem),
      {
        border: core.border.thin,
        width: ch(50),
        overflow: "hidden",
        allowMultipleExpansions: false,
      }
    )
  );
}
