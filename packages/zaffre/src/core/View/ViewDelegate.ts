import { Attributes } from ":attributes";
import { EffectsBundle } from ":effect";

//
// A ViewDelegate handles the specifics for either HTML or SVG views.
//

type ZElement = HTMLElement | SVGElement;

export abstract class ViewDelegate {
  constructor() {}

  abstract createElement(tagName: string): ZElement;
  abstract offsetLeft(): number;
  abstract offsetTop(): number;
  abstract setCSSClass(clsName: string): void;
  abstract defaultInteractionEffects(): EffectsBundle;

  beforeAddedToDOM(): void {}
  afterAddedToDOM(): void {}
  initializeHandlers(): void {}
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
