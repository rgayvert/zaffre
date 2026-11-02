import { getRootView, View, ViewOptions } from "./View";

export class HotKeyDelegate {
  hotKeyViews?: Set<View>;

  constructor(public view: View) {
    this.initializeHotKeys();
  }
  get options(): ViewOptions {
    return this.view.options;
  }

  initializeHotKeys(): void {
    const hotKeys = this.options.hotKeys;
    if (hotKeys) {
      this.view.addIntersectionAction((visible) => {
        if (visible) {
          getRootView().addHotKeyListener(this.view);
        } else {
          getRootView().removeHotKeyListener(this.view);
        }
      });
    }
  }
  ignoreHotKey(): boolean {
    const activeElt = document.activeElement;
    if (activeElt instanceof HTMLElement && activeElt.isContentEditable) {
      return true;
    }
    const activeTag = activeElt?.tagName.toLowerCase() || "";
    return ["input", "select", "textarea"].includes(activeTag);
  }
  handleHotKey(evt: KeyboardEvent): void {
    if (!this.ignoreHotKey()) {
      Array.from(this.hotKeyViews || []).forEach((view) => view.options.hotKeys?.get(evt.key)?.());
    }
  }

  addHotKeyListener(view: View): void {
    if (!this.hotKeyViews) {
      this.hotKeyViews = new Set();
      this.view.addEventListener("keydown", (evt) => this.handleHotKey(<KeyboardEvent>evt));
    }
    this.hotKeyViews.add(view);
  }
  removeHotKeyListener(view: View): void {
    this.hotKeyViews?.delete(view);
  }
}
