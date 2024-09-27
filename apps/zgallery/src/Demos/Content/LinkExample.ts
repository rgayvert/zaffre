import { View, core, HStack, Link, Spacer, Button, carouselAtom } from "zaffre";

const site1 = "https://example.com";
const site2 = "https://www.lipsum.com";

export function LinkExample(): View {
  const gridURI = "link.gridexamples";
  const url = carouselAtom([site1, site2], site1);
  return HStack().append(
    Link(gridURI, { text: "Grid Example"}),
    Spacer(core.space.s7),
    Link(url, { text: "Example Site", target: "_blank" }),
    Spacer(core.space.s4),
    Button({ 
      label: "change", 
      action: () => url.next(), 
      controlSize: "xs",
      rounding: core.rounding.pill
     }),
  );
}
