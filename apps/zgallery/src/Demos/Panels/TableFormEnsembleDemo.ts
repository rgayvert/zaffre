import { View } from "zaffre";
import { GalleryTopic, GalleryDemo } from "../Common";
import { TFEnsembleExample } from "./TFEnsembleExample";

export function TFEnsembleDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = { 
  sourceDir: "/source/Demos/Panels",
  sections: [
    {
        title: "Table Form Ensemble",
        componentFn: TFEnsembleExample,
        sources: ["TFEnsembleExample.ts", "DemoUserRecord.ts", "DemoUserFields.ts", "DemoUserModel.ts"],
        markdown: "TFEnsembleExample.md",
      },
  ],
};

export default TFEnsembleDemo;
