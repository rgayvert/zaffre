import { lazyinit, Point2D, point2D } from ":foundation";
import { Attributes } from ":attributes";
import { EffectsBundle, standardSVGInteractionEffects } from ":effect";
import { View, ViewOptions, ViewDelegate, viewWithEventListener } from ":view";
import { SVGOptions } from "./SVGOptions";

// 
// Each SVG view has an SVGDelegate, which defines the SVG-specific behavior.
// 

export enum SVGConstants {
  NS = "http://www.w3.org/2000/svg",
}

export function getSVGPointFromEvent(evt: MouseEvent): Point2D {
    const target = viewWithEventListener(evt);
    if (target?.delegate instanceof SVGDelegate) {
      const svgElt = <SVGGraphicsElement>target.delegate.svgElt;
      const pt = new DOMPoint(evt.clientX, evt.clientY);
      const svgPt = pt.matrixTransform(svgElt.getScreenCTM()?.inverse());
      return point2D(svgPt.x, svgPt.y);
    } else {
      return point2D(0, 0);
    }
  }

export function CreateSVGView(tagName: string, svgKeys: string[], cssKeys: string[], options: ViewOptions = {}): View {
  options.tag = tagName;
  return new View(new SVGDelegate(svgKeys, cssKeys), options);
}

export function isSVGView(view: View | undefined): boolean {
  return Boolean(view && view.delegate instanceof SVGDelegate);
}

export class SVGDelegate extends ViewDelegate {
  @lazyinit public static get defaultOptions(): ViewOptions {
    return {};
  }

  get options(): SVGOptions {
    return this.view.options;
  }

  cssAttributes(): Attributes {
    return <Attributes>Object.fromEntries(this.cssKeys.map((key) => [key, (this.options as any)[key]]));
  }
  svgAttributes(): Attributes {
    return <Attributes>Object.fromEntries(this.svgKeys.map((key) => [key, (this.options as any)[key]]));
  }
  public svgAttributeSummary(): string {
    let summary = "";
    Object.entries(this.svgAttributes()).forEach(([key, value]) => {
      if (value) {
        summary += `  ${key}: ${value}\n`;
      }
    });
    return summary ? "\nsvg properties:\n" + summary : "";
  }
  //////////////////////////////////////////////////////////////////////////////

  constructor(public svgKeys: string[], public cssKeys: string[]) {
    super();
  }

  //////////////////////////////////////////////////////////////////////////////

  // Delegate methods

  get svgElt(): SVGElement {
    return <SVGElement>this.view.elt;
  }
  createElement(tagName: string): SVGElement {
    const elt = document.createElementNS(SVGConstants.NS, tagName);
    elt.id = this.view.zname;
    return elt;
  }
  tagName(): string {
    return this.options.tag || "div";
  }
  offsetLeft(): number {
    return this.view.clientRect().x - this.view.parentClientRect2D().x;
  }
  offsetTop(): number {
    return this.view.clientRect().y - this.view.parentClientRect2D().y;
  }
  get overlay(): View {
    return this.view;
  }
  setCSSClass(clsName: string): void {
    this.svgElt.setAttribute("class", clsName);
  }
  // Interaction effects are applied directly the SVG view, not to an overlay
  public defaultInteractionEffects(): EffectsBundle {
    return standardSVGInteractionEffects();
  }

  widthOfChildren(): number {
    if (this.view.elt.children.length === 0) {
      return 0;
    }
    const child = <SVGTextElement>this.view.elt.children[0];
    return child.getBBox().width;
  }

  isContainer(): boolean {
    return this.options.tag === "svg";
  }
  container(): View | undefined {
    if (this.isContainer()) {
      return this.view;
    } else {
      const parent = this.view.parent;
      if (parent && isSVGView(parent)) {
        return (<SVGDelegate>parent.delegate).container();
      } else {
        return undefined;
      }
    }
  }

  animatingView(): View {
    return this.container() || this.view;
  }

  // Options that can take a url may be specified with a direct reference to the view.
  // Here we convert these to a URL string. 
  // SVGMarkerRef, SVGPaint

  urlOptionKeys = ["fill", "stroke", "marker", "markerStart", "markerMid", "markerEnd"]

  adjustOptions(): void {
    const optionsKeys = Object.keys(this.options);
    this.urlOptionKeys.forEach((key) => {
      if (optionsKeys.includes(key)) {
        const val = (this.options as any)[key];
        if (val instanceof View) {
          (this.options as any)[key] = val.url;
        }
      }
    });
  }

}
