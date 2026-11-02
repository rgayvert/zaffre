import { Ensemble, pct, Box, ScrollPane, zcolor, zspace, RoutingEnsemble, ViewCreator, setRouterAtom, MappedEnsemble } from "zaffre";
import { GalleryModel, galleryTopics, DemoTopicComponent, infoPages } from "../Model";

//
// DemoPane is an ensemble that creates demos as needed.
//

// the left menu selection changed; create a view for the selected item
const DemoContentView = (key: string) => {
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

export const DemoPane = (model: GalleryModel) => {

  const items = [...galleryTopics.keys()].map((key) => [key, () => DemoContentView(key)] as [string, ViewCreator]);
  const map = new Map(items);

  //setRouterAtom(model.selectedDemoKey);

  return ScrollPane({ width: pct(100), height: pct(100) }).append(
    MappedEnsemble(model.selectedDemoKey, map,
    {
      background: zcolor.background,
      padding: zspace.s0,
      name: "DemoPane",
      display: "flex",
      justifyContent: "center",
    })
  );
}
