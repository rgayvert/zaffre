import { GalleryDemo, GalleryTopic } from "../Common";
import { ColumnAreaForm, GridAreaForm } from ".";

export const FormsDemo = () => {
  return GalleryDemo(topic);
};

const demoDir = "../Common/DemoUser";
 
const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Forms",
  sections: [
    {
      title: "Grid Area Form",
      componentFn: GridAreaForm,
      sources: [
        ["View", "GridAreaForm/GridAreaForm.ts"],
        ["UserRecord", `${demoDir}/DemoUser.ts`],
        ["UserFields", `${demoDir}/DemoUserFields.ts`],
      ],
      markdown: "GridAreaForm.md",
    },
    {
      title: "Column Area Form",
      componentFn: ColumnAreaForm,
      sources: [
        ["View", "ColumnAreaForm/ColumnAreaForm.ts"],
        ["UserRecord", `${demoDir}/DemoUser.ts`],
        ["UserFields", `${demoDir}/DemoUserFields.ts`],
      ],
      markdown: "ColumnAreaForm.md",
    },
  ], 
};

export default FormsDemo;
