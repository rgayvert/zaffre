import { Theme, LocalData, atom, delayedAtom, zlog, TreeNode, KeyAndTitle, routeAtom } from "zaffre";
import { galleryThemeKey, createGalleryThemeNamed } from "./GalleryThemes";
import { galleryTree } from "./GalleryRoutes";
import { galleryTopics } from "./GalleryTopics";

export class GalleryModel {

  logLevels = ["none", "info", "warn", "debug", "trace"];
  logLevel = atom("info", { action: (val) => zlog.setLevel(this.logLevels.indexOf(val)) });

  settingsHidden = delayedAtom(true);
  floatingTreeHidden = atom(true);
  contrast = atom("7.0", { action: (val) => Theme.default.colorContrastRatio.set(parseFloat(val)) });

  routeTree = galleryTree;
  selectedDemo = atom<TreeNode<KeyAndTitle> | undefined>(undefined, { action: (node) => node && this.selectedDemoKey.set(node.data.key)});
  selectedDemoKey = routeAtom("demos", "", { values: [...galleryTopics.keys()] });

  constructor() {
    // expand the gallery tree when the route changes
    this.selectedDemoKey.addAction((key) => this.selectedDemo.set(galleryTree.bfs((node) => node.data.key === key)));
    this.selectedDemo.addAction(() => this.floatingTreeHidden.set(true));
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


  // hide the floating sidebar after selecting a demo
  // navSelectionChanged(node?: RouteNode): void {
  //   const routePoint = node?.data;
  //   if (routePoint && routePoint.endpoint && !zget(this.floatingTreeHidden)) {
  //     this.floatingNavViewHidden.set(true);
  //   }
  // }
}
