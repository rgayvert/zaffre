import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { TableExample1 } from "./TableExample1";
import { TableExample2 } from "./TableExample2";
import { TableExample3 } from "./TableExample3";
import { TableExample4 } from "./TableExample4";
import { TableExample5 } from "./TableExample5";

export function TableExample(): View {
  return GalleryDemo(topic);
} 

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Tables",
  sections: [
    {
      title: "Table with default layout",
      componentFn: TableExample1,
      sources: ["TableExample1.ts"],
      markdown: "TableExample1.md",
    },
    {
      title: "Table with record list",
      componentFn: TableExample2,
      sources: ["ExampleTableModel2.ts", "TableExample2.ts"],
      markdown: "TableExample2.md",
    },
    {
      title: "Table with some customization",
      componentFn: TableExample3,
      sources: ["ExampleTableModel3.ts", "TableExample3.ts"],
      markdown: "TableExample3.md",
    }, 
    {
      title: "Table with row/column editing",
      componentFn: TableExample4,
      sources: ["TableExample4.ts"],
      markdown: "TableExample4.md",
    }, 
    {
      title: "Table with cell editing",
      componentFn: TableExample5,
      sources: ["ExampleTableModel5.ts", "TableExample5.ts"],
      markdown: "TableExample5.md",
    }, 
    
  ],
};


export default TableExample;
