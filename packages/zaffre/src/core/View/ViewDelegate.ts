import { Attributes } from ":attributes";
import { View, ViewOptions, ZElement } from "./View";
import { Effects } from ":effect";

//
//
//

export abstract class ViewDelegate {
  view!: View; 

  constructor() {}

  get options(): ViewOptions { 
    return this.view.options;
  }
  abstract createElement(tagName: string): ZElement;
  abstract tagName(): string;
  abstract offsetLeft(): number;
  abstract offsetTop(): number;
  abstract get overlay(): View;
  abstract setCSSClass(clsName: string): void;
  abstract defaultInteractionEffects(): Effects;

  beforeAddedToDOM(): void {}
  afterAddedToDOM(): void {}
  initializeHandlers(): void {}
  appendChild(childView: View): void {
    this.view.addChild(childView);
    this.options.afterAppendChild?.(this.view, childView);
  }
  adjustOptions(): void {}

  htmlAttributes(): Attributes {
    return {};
  }
  htmlAttributeSummary(): string {
    return "";
  }
  cssAttributes(): Attributes {
    return {};
  }
  svgAttributes(): Attributes {
    return {};
  }
  svgAttributeSummary(): string {
    return "";
  }
}
