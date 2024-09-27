import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { ComponentAnimationExample1 } from "./ComponentAnimationExample1";
import { ComponentAnimationExample2 } from "./ComponentAnimationExample2";
import { HoverAnimationExample } from "./HoverAnimationExample";
import { FrameBasedAnimationExample } from "./FrameBasedAnimationExample";
import { SpriteAnimationExample } from "./SpriteAnimationExample";

export function AnimationDemo(): View {
  return GalleryDemo(topic);
}

//
// Note: the first example has an indeterminate animation, so if it's running, the lazy creation
// of Notes, Source, or DOM gets held up. Hence, we preload these views.
//

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Animation",
  sections: [ 
    {
      title: "Component Animation 1",
      componentFn: ComponentAnimationExample1,
      sources: ["ComponentAnimationModel1.ts", "ComponentAnimationExample1.ts"],
      markdown: "ComponentAnimationExample1.md",
      preload: true,
    }, 
    {
      title: "Component Animation 2",
      componentFn: ComponentAnimationExample2,
      sources: ["ComponentAnimationModel2.ts", "ComponentAnimationExample2.ts"],
      markdown: "ComponentAnimationExample2.md",
    },
    {
      title: "Hover Animation",
      componentFn: HoverAnimationExample,
      sources: ["HoverAnimationModel.ts", "HoverAnimationExample.ts"],
      markdown: "HoverAnimationExample.md",
    },
    {
      title: "Frame-based animation",
      componentFn: FrameBasedAnimationExample,
      sources: ["FrameBasedAnimationModel.ts", "FrameBasedAnimationExample.ts"],
      markdown: "FrameBasedAnimationExample.md",
    },
    {
      title: "Sprite animation",
      componentFn: SpriteAnimationExample,
      sources: ["SpriteAnimationModel.ts", "SpriteAnimationExample.ts"],
      markdown: "SpriteAnimationExample.md",
    },
  ],
};

export default AnimationDemo;
