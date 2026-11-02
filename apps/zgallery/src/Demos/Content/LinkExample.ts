import { HStack, Link, Spacer, Button, carouselAtom, zrounding, zspace } from "zaffre";

const site1 = "https://example.com";
const site2 = "https://www.lipsum.com";

export const LinkExample = () => {
  const gridURI = "link.gridexamples";
  const url = carouselAtom([site1, site2], site1);
  return HStack().append(
    Link(gridURI, { text: "Grid Example"}),
    Spacer("s7"),
    Link(url, { text: "Example Site", target: "_blank" }),
    Spacer("s4"),
    Button({ 
      label: "change", 
      action: () => url.next(), 
      controlSize: "xs",
      rounding: zrounding.pill
     }),
  );
}
