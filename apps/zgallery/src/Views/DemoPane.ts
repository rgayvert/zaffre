import { core, View, Ensemble, pct, Box, ScrollPane, zlog } from "zaffre";
import { GalleryModel, galleryTopics, DemoTopicComponent, infoPages } from "../Model";

//
// DemoPane is an ensemble that creates demos as needed.
//

// the left menu selection changed; create a view for the selected item
function DemoContentView(key: string): View {
  const topic = galleryTopics.get(key);
  const info = infoPages.find((info) => info.key === key);
  //zlog.info("DemoContentView: "+key);

  if (topic) {
    return DemoTopicComponent(topic);
  } else if (info) {
    return info.viewCreator();
  } else {
    return Box(); // TODO: some kind of missing box
  }
}

export function DemoPane(model: GalleryModel): View {
  return ScrollPane({ width: pct(100), height: pct(100)}).append(
    Ensemble(model.selectedDemoKey, (key: string) => DemoContentView(key), {
      background: core.color.background,
      padding: core.space.s0,
      name: "DemoPane",
      display: "flex",
      justifyContent: "center",
    })
  );
}
