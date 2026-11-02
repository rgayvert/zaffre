import { zutil } from ":foundation";
import { View, ViewOptions } from "./View";
import { EffectsBundle, isInteractionState } from ":effect";
import { contentChangedHandler, Handler, hiddenHandler, interactionHandler } from ":events";
import { mountedHandler, mouseHandler, MouseHandler, selectedHandler } from ":events";

export class EffectDelegate {
  constructor(public view: View) {
  }

  get options(): ViewOptions {
    return this.view.options;
  }

  addHandler(handler: Handler<unknown>): void {
    this.view.addHandler(handler);
  }

  initializeEffects(effects: EffectsBundle): void {
    const interactionKeys = Object.keys(effects).filter((key) => isInteractionState(key));
    if (interactionKeys.length > 0) {
      this.addHandler(interactionHandler(zutil.pick(effects, interactionKeys)));
    }
    if (interactionKeys.includes("clicked")) {
      if (!this.view.handlers.some((h) => h instanceof MouseHandler)) {
        this.addHandler(mouseHandler({ click: (): void => undefined }));
      }
    }
    if (effects.contentChanged) {
      this.addHandler(contentChangedHandler(effects.contentChanged));
    }
    if (effects.hidden) {
      this.addHandler(hiddenHandler(effects.hidden));
    }
    if (effects.mounted) {
      this.addHandler(mountedHandler(effects.mounted));
    }
    if (effects.selected) {
      this.addHandler(selectedHandler(effects.selected));
    }
  }
}
