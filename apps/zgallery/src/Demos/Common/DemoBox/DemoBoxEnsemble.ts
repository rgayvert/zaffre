import { View, RouteAtom, EnsembleViewCreators, FixedEnsemble, Atom } from "zaffre";
import { EnsembleOptions, zborder } from "zaffre";
import { DemoSourceView } from "../DemoSourceView";
import { Markdown } from "../Markdown";
import { GalleryTopic, GallerySection } from "../GalleryTypes";


export type DemoBoxViewType = "notes" | "source" | "demo";

export const DemoBoxEnsemble = (
  container: View,
  section: GallerySection,
  topic: GalleryTopic,
  viewKey: Atom<DemoBoxViewType>,
  fullPage: boolean
) => {
  const creators: EnsembleViewCreators<DemoBoxViewType> = {
    "demo": () => container,
    "source": () => DemoSourceView(topic.sourceDir!, section.sources, fullPage),
    "notes": () => Markdown({
        uri: section.markdown
          ? `${topic.sourceDir || ""}/${section.markdown}`
          : "",
      })
  };
  const opts: EnsembleOptions<DemoBoxViewType> = fullPage
    ? {}
    : {
        borderTop: zborder.thin,
        overflowY: "hidden",
        preloadList: section.preload
          ? ["demo", "notes", "source"]
          : undefined,
      };

  return FixedEnsemble(viewKey, creators, opts); 
};
