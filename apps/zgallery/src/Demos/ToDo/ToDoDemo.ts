import { GalleryDemo, GalleryTopic } from "../Common";
import { ToDo } from ":todo";

export const ToDoDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/ToDo",
  sections: [
    {
      title: "ToDo",
      componentFn: () => ToDo(),
      sources: [
        ["ToDo", "View/ToDo.ts"], 
        ["ButtonBar", "View/ToDoButtonBar.ts"],
        ["InputRow", "View/ToDoInputRow.ts"],
        ["ItemList", "View/ToDoItemList.ts"],
        ["ItemRow", "View/ToDoItemRow.ts"],
        ["DBSelector", "View/ToDoDbSelector.ts"],
        ["Model", "Model/ToDoModel.ts"], 
        ["Data", "Data/ToDoData.ts"],
      ],
      markdown: "ToDo.md",
    },
  ],
};

export default ToDoDemo;
