import { Theme, LocalData, atom, delayedAtom, zlog, TreeNode, recordAtom, setRouterAtom } from "zaffre";
import { KeyAndTitle, routeAtom, App, LogLevel } from "zaffre";
import { createGalleryThemeNamed, GalleryThemeKey } from "./GalleryThemes";
import { galleryTree } from "./GalleryRoutes";
import { galleryTopics, infoPages } from "./GalleryTopics";

//
// The GalleryModel instance tracks the top-level state of the gallery app.
//

export type GallerySettingsRecord = {
  themeName: GalleryThemeKey;
  contrast: number;
  fluidFonts: boolean;
  logLevel: LogLevel;
};

export class GalleryModel {
  initialSettings: GallerySettingsRecord = {
    themeName: "blue",
    contrast: 7.0,
    fluidFonts: App.fluidFonts.get(),
    logLevel: zlog.logLevel,
  };
  gallerySettings = recordAtom(this.initialSettings);
  get currentSettings(): GallerySettingsRecord {
    return this.gallerySettings.get();
  }

  logLevel = atom(() => this.currentSettings.logLevel, { action: (val) => zlog.setLevel(val) });
  contrast = atom(() => this.currentSettings.contrast, { action: (val) => Theme.default.colorContrastRatio.set(val) });
  themeName = atom(() => this.currentSettings.themeName, {
    action: (val) => Theme.setDefault(createGalleryThemeNamed(val)),
  });
  fluidFonts = atom(() => this.currentSettings.fluidFonts, { action: (val) => App.fluidFonts.set(val) });

  settingsHidden = delayedAtom(true);

  //routeTree = galleryTree;
  selectedDemo = atom<TreeNode<KeyAndTitle> | undefined>(undefined, { action: (node) => this.demoChanged(node) });
  selectedDemoKey = atom("", { action: (key) => this.demoKeyChanged(key) });
  selectedDemoPath = atom("", { action: (path) => this.demoPathChanged(path) });

  //() => this.selectedDemo.get()?.fullPath().map((tn) => tn.data.key).slice(1).join("/") || "");

  selectedDemoHasTopicOrInfo(): boolean {
    const node = this.selectedDemo.get();
    const key = node?.data.key || "";
    const topic = galleryTopics.get(key);
    const info = infoPages.find((info) => info.key === key);
    return Boolean(node && (topic || info));
  }

  demoChanged(node: TreeNode<KeyAndTitle>): void {
    this.selectedDemoKey.set(node.data.key);
  }
  demoKeyChanged(key: string): void {
    this.selectedDemo.set(galleryTree.bfs((node) => node.data.key === key));
    this.selectedDemoPath.set(this.selectedDemo.get()?.fullPath().map((tn) => tn.data.key).slice(1).join("/") || "");
  }
  demoPathChanged(path: string): void {
    const key = path.split("/").at(-1);
    key && this.demoKeyChanged(key);
  }

  constructor() {
    // expand the gallery tree when the route changes
    //this.selectedDemoKey.addAction((key) => this.selectedDemo.set(galleryTree.bfs((node) => node.data.key === key)));
  
    setRouterAtom(this.selectedDemoPath);
  }

  resetData(): void {
    LocalData.instance.resetAll();
  }
  toggleColorMode(): void {
    Theme.default.toggleColorMode();
  }
}
