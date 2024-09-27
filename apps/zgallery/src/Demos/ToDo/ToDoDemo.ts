import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { ToDo } from ":todo";


export function ToDoDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/ToDo",
  sections: [
    {
      title: "ToDo",
      componentFn: () => ToDo(),
      sources: ["View/ToDo.ts", "View/ToDoButtonBar.ts", "View/ToDoInputRow.ts",
        "View/ToDoItemList.ts", "View/ToDoItemRow.ts", "View/ToDoStoreSelector.ts", 
        "Model/ToDoModel.ts", "Data/ToDoData.ts"],
      markdown: "ToDo.md",
    },

  ],
};

export default ToDoDemo;
