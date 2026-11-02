import { GridLayout, GridLayoutSpec, px, TextBox, zborder, zcolor } from "zaffre";

// Adapted from https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Realizing_common_layouts_using_grids

export const ResponsiveGridLayoutExample = () => {
  const content = `<h1>Main article area</h1><p>
    In this layout, we display the areas in source order for a small screen. 
    We go to a two column layout, and then to a three
    column layout by redefining the grid, and the placement of items on the grid.`;
  const nav = `Link 1<br>Link 2<br>Link 3`;

  const SampleText = (gridArea: string, content: string) => {
    return TextBox(content, {
      gridArea: gridArea,
      background: zcolor.background,
      color: zcolor.primary,
    });
  }

  const small: GridLayoutSpec = {
    templateAreas: `"header" "nav" "content" "sidebar" "ad" "footer"`,
    //templateAreas: "h.n.c.s.a.f",
    gap: px(1),
  };
  const medium: GridLayoutSpec = {
    //templateAreas: "hh.nn.sc.af",
    templateAreas: `
       "header  header"
       "nav     nav"
       "sidebar content"
       "ad      footer"`,
    columns: "1fr 3fr",
    gap: px(1),
  };
  const large: GridLayoutSpec = {
    //templateAreas: "hhh.ncs.nca.fff",
    templateAreas: `
      "header header  header"
      "nav    content sidebar"
      "nav    content ad"
      "footer footer  footer"`,
    columns: "1fr 4fr 1fr",
    gap: px(1),
  };
  return GridLayout({small, medium, large}, { border: zborder.thin, background: zcolor.tertiary }).append(
    SampleText("header", "The header"),
    SampleText("content", content),
    SampleText("nav", nav),
    SampleText("sidebar", "Sidebar"),
    SampleText("ad", "Advertising and more"),
    SampleText("footer", "The footer")
    // SampleText("h", "The header"),
    // SampleText("c", content),
    // SampleText("n", nav),
    // SampleText("s", "Sidebar"),
    // SampleText("a", "Advertising and more"),
    // SampleText("f", "The footer")
  );
}
