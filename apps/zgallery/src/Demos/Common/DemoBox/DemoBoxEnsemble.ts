import { Box, View, Ensemble, RouteAtom, EnsembleOptions } from "zaffre";
import { core, pct } from "zaffre";
import { DOMInspector, DOMInspectorOptions } from "../DOMInspector";
import { DemoSourceView } from "../DemoSourceView";
import { Markdown } from "../Markdown";
import { GalleryTopic, GallerySection } from "../GalleryTypes";

export function DemoBoxEnsemble(
  container: View,
  section: GallerySection,
  topic: GalleryTopic,
  viewKey: RouteAtom,
  fullPage: boolean
): View {
  function DemoComponent(key: string): View {
    if (key === "dom") {
      const domOptions: DOMInspectorOptions = fullPage
        ? { height: pct(100), maxHeight: undefined, borderBottom: core.border.thin }
        : {};
      return DOMInspector(container.children.at(0) || container, domOptions);
    } else if (key === "notes") {
      return Markdown({ uri: section.markdown ? `${topic.sourceDir || ""}/${section.markdown}` : "" });
    } else if (key === "source") {
      return DemoSourceView(topic.sourceDir!, section.sources);
    } else if (key === "demo") {
      return container;
    } else {
      return Box(); // TODO: some kind of missing box
    }
  }
  const opts: EnsembleOptions = fullPage
    ? {}
    : {
        borderTop: core.border.thin,
        overflowY: "hidden",
        preloadList: section.preload ? ["demo", "notes", "source", "dom"] : undefined,
      };

  return Ensemble(viewKey, (key) => DemoComponent(key), opts);
}
