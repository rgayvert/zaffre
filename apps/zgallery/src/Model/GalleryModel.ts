import { Theme, LocalData, atom, delayedAtom, zlog, TreeNode, KeyAndTitle, routeAtom } from "zaffre";
import { galleryThemeKey, createGalleryThemeNamed } from "./GalleryThemes";
import { galleryTree } from "./GalleryRoutes";
import { galleryTopics, infoPages } from "./GalleryTopics";

//
// The GalleryModel instance tracks the top-level state of the gallery app. 
//

export class GalleryModel {

  logLevels = ["none", "info", "warn", "debug", "trace"];
  logLevel = atom("info", { action: (val) => zlog.setLevel(this.logLevels.indexOf(val)) });

  settingsHidden = delayedAtom(true);
  contrast = atom("7.0", { action: (val) => Theme.default.colorContrastRatio.set(parseFloat(val)) });

  routeTree = galleryTree;
  selectedDemo = atom<TreeNode<KeyAndTitle> | undefined>(undefined, { action: (node) => node && this.selectedDemoKey.set(node.data.key)});
  selectedDemoKey = routeAtom("demos", "", { values: [...galleryTopics.keys()] });

  selectedDemoHasTopicOrInfo(): boolean {
    const node = this.selectedDemo.get();
    const key = node?.data.key || "";
    const topic = galleryTopics.get(key);
    const info = infoPages.find((info) => info.key === key);
    return Boolean(node && (topic || info));
  }

  constructor() {
    // expand the gallery tree when the route changes
    this.selectedDemoKey.addAction((key) => this.selectedDemo.set(galleryTree.bfs((node) => node.data.key === key)));
  }

  public currentThemeName = atom<galleryThemeKey>("blue", {
    action: (val) => Theme.setDefault(createGalleryThemeNamed(val)),
  });

  resetData(): void {
    LocalData.instance.resetAll();
  }
  toggleColorMode(): void {
    Theme.default.toggleColorMode();
  }

}
