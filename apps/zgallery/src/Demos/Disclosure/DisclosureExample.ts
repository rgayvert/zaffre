import { TextBox, lorem, HStack, TextDisclosure, ch, zborder, zspace, toggleAtom } from "zaffre";

interface DemoItem {
  title: string;
  detail: string;
}
const disclosureData: DemoItem = { title: "Some title", detail: lorem.sentences(50) };

export const DisclosureExample = () => {

  const DisclosureDetail = (dataItem: DemoItem) => {
    return TextBox(dataItem.detail, {
      padding: zspace.s3,
      borderTop: zborder.thin,
      overflow: "hidden",
    });
  }

  return HStack({ padding: zspace.s5 }).append(
    TextDisclosure(disclosureData, toggleAtom(false), disclosureData.title, (dataItem: DemoItem) => DisclosureDetail(dataItem), {
      border: zborder.thin,
      width: ch(50),
      overflow: "hidden",
    })
  );
}
