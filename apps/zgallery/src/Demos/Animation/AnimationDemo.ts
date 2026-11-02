import { GalleryDemo, GalleryTopic } from "../Common";
import { BasicAnimation1 } from "./BasicAnimation1";
import { BasicAnimation2 } from "./BasicAnimation2";
import { HoverAnimation1 } from "./HoverAnimation";
import { FrameBasedAnimationExample } from "./FrameBasedAnimation";
import { SpriteAnimation1 } from "./SpriteAnimation";

export const AnimationDemo = () => {
  return GalleryDemo(topic);
};

//
// Note: the first example has an indeterminate animation, so if it's running, the lazy creation
// of Notes, Source, or DOM gets held up. Hence, we preload these views.
//

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Animation",
  sections: [
    {
      title: "Basic Animation 1",
      componentFn: BasicAnimation1,
      sources: [
        ["View", "BasicAnimation1/BasicAnimation1.ts"],
        ["Model", "BasicAnimation1/BasicModel1.ts"],
        ["Rules", "BasicAnimation1/BasicAnimation1.rules.ts"],
      ],
      markdown: "BasicAnimation1/BasicAnimation1.md",
      preload: true,
    },
    {
      title: "Basic Animation 2",
      componentFn: BasicAnimation2,
      sources: [
        ["View", "BasicAnimation2/BasicAnimation2.ts"],
        ["Model", "BasicAnimation2/BasicModel2.ts"],
        ["Rules", "BasicAnimation2/BasicAnimation2.rules.ts"],
      ],
      markdown: "BasicAnimation2/BasicAnimation2.md",
    },
    {
      title: "Hover Animation",
      componentFn: HoverAnimation1,
      sources: [
        ["Model", "HoverAnimation/HoverAnimationModel.ts"],
        ["View", "HoverAnimation/HoverAnimation1.ts"],
        ["Rules", "HoverAnimation/HoverAnimation1.rules.ts"],
      ],
      markdown: "HoverAnimation/HoverAnimation1.md",
    },
    {
      title: "Frame-based animation",
      componentFn: FrameBasedAnimationExample,
      sources: [
        ["Model", "FrameBasedAnimation/FrameBasedAnimationModel.ts"],
        ["View", "FrameBasedAnimation/FrameBasedAnimation1.ts"],
        ["Rules", "FrameBasedAnimation/FrameBasedAnimation1.rules.ts"],
      ],
      markdown: "FrameBasedAnimation/FrameBasedAnimation1.md",
    },
    {
      title: "Sprite animation",
      componentFn: SpriteAnimation1,
      sources: [
        ["Model", "SpriteAnimation/SpriteAnimationModel.ts"],
        ["View", "SpriteAnimation/SpriteAnimation1.ts"],
        ["Rules", "SpriteAnimation/SpriteAnimation1.rules.ts"],
      ],
      markdown: "SpriteAnimation/SpriteAnimation1.md",
    },
  ],
};

export default AnimationDemo;
