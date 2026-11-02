import { GalleryDemo, GalleryTopic } from "../Common";
import { TableExample1 } from "./TableExample1";
import { TableExample2 } from "./TableExample2";
import { TableExample3 } from "./TableExample3";
import { TableExample4 } from "./TableExample4";
import { TableExample5 } from "./TableExample5";

export const TableExample = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Tables",
  sections: [
    {
      title: "Table with default layout",
      componentFn: TableExample1,
      sources: [["View", "TableExample1.ts"]],
      markdown: "TableExample1.md",
    },
    {
      title: "Table with record list",
      componentFn: TableExample2,
      sources: [
        ["Model", "ExampleTableModel2.ts"],
        ["View", "TableExample2.ts"],
      ],
      markdown: "TableExample2.md",
    },
    {
      title: "Table with some customization",
      componentFn: TableExample3,
      sources: [
        ["Model", "ExampleTableModel3.ts"],
        ["View", "TableExample3.ts"],
      ],
      markdown: "TableExample3.md",
    },
    {
      title: "Table with row/column editing",
      componentFn: TableExample4,
      sources: [["View", "TableExample4.ts"]],
      markdown: "TableExample4.md",
    },
    {
      title: "Table with cell editing",
      componentFn: TableExample5,
      sources: [
        ["Model", "ExampleTableModel5.ts"],
        ["View", "TableExample5.ts"],
      ],
      markdown: "TableExample5.md",
    },
  ],
};

export default TableExample;
