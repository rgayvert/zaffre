import { Atom, atom, lazyinit, zget, znumber } from ":foundation";
import { Attributes, ColorToken, css_color, css_rounding, css_textAlign, pct, px, vh, vw } from ":attributes";
import { allSheets, BV, defineBundle, defineComponentBundle, mergeComponentOptions } from ":view";
import { OptionSheet, restoreOptions, sheetStack } from ":view";
import { core } from ":theme";
import { place } from ":uifoundation";
import { View, ViewDelegate, ViewOptions, beforeAddedToDOM } from ":view";
import { dropShadowForElevation, EffectsBundle, standardHTMLInteractionEffects } from ":effect";
import { DragHandler } from ":events";
import { CSSAttributeOptions, cssOptionKeys, htmlAttributeKeys, HTMLAttributeOptions } from "../CoreOptions";
import { StatusBarAlignment } from "vscode";

//
// Base support for HTML views. This includes the HTMLDelegate class, the low-level HTML component,
// the HTMLBody component, the ViewOverlay component, and components for the floating, dialog and
// toast layers.
//

export interface HTMLOptions extends ViewOptions, HTMLAttributeOptions, CSSAttributeOptions {
  rounding?: css_rounding;
  selectionColor?: css_color;
  selectionTextColor?: css_color;
  maintainMinHeight?: boolean;
  scale?: znumber;
  controlSize?: ControlSize;
}

export function isHTMLView(view: View): boolean {
  return view.delegate instanceof HTMLDelegate;
}

// sizes use a factor of 1.15
const controlSizes = ["xs", "sm", "med", "lg", "xl", "xxl"] as const;
const controlSizeFactors = [0.75, 0.87, 1.0, 1.15, 1.32, 1.52];
export type ControlSize = (typeof controlSizes)[number];

export class HTMLDelegate extends ViewDelegate {
  private static _rootView: View;
  private static _bodyView: View;
  public static baseView: View;

  public static get rootView(): View {
    if (!this._rootView) {
      this._rootView = new View(new HTMLDelegate(), { id: "_root" });
      View.rootView = this._rootView;
      this._bodyView = HTMLBody();
      this._bodyView.setParent(View.rootView);
      View.bodyView = this._bodyView;
      View.rootView.children.push(View.bodyView);
      // wait until setBaseView() to set the body style
    }
    return this._rootView;
  }
  public static get bodyView(): View {
    return this._bodyView;
  }
  public static setBaseView(view: View): void {
    this.baseView = view;
    this.bodyView.afterAddedToDOM();
    this.bodyView.appendAndRender(view);
  }
  @lazyinit static get floatingLayer(): View {
    return FloatingLayer();
  }
  @lazyinit static get dialogLayer(): View {
    return DialogLayer();
  }
  @lazyinit static get toastLayer(): View {
    return ToastLayer();
  }

  get options(): HTMLOptions {
    return this.view.options;
  }
  get htmlElt(): HTMLElement {
    return <HTMLElement>this.view.elt;
  }
  createElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }
  tagName(): string {
    return this.options.tag || "div";
  }
  offsetLeft(): number {
    return this.htmlElt.offsetLeft;
  }
  offsetTop(): number {
    return this.htmlElt.offsetTop;
  }
  setCSSClass(clsName: string): void {
    this.htmlElt.className = clsName;
  }

  _overlay?: View;
  get overlay(): View {
    if (!this._overlay) {
      this._overlay = ViewOverlay();
      this.view.appendAndRender(this._overlay);
    }
    if (!this._overlay.elt.parentElement) {
      this._overlay.attach();
    }
    return this._overlay;
  }

  public defaultInteractionEffects(): EffectsBundle {
    return standardHTMLInteractionEffects();
  }

  afterAddedToDOM(): void {
    if (this.options.placement) {
      if (this.options.placement instanceof Atom) {
        this.options.placement.addAction(() => this.view.place());
      }
      this.view.addResizeAction(() => this.view.place());
      this.view.addIntersectionAction(() => this.view.place());
    }
  }
  beforeAddedToDOM(): void {
    this.options.zIndex ??= this.view.floatingCount();
  }
  initializeHandlers(): void {
    // TODO: what if we need draggable to be an atom?
    this.options.draggable = this.view.actors?.some((a) => a instanceof DragHandler);
  }
  appendChild(childView: View): void {
    if (childView.isFloating() && this.view !== HTMLDelegate.floatingLayer) {
      childView.referenceView = this.view;
      HTMLDelegate.floatingLayer.appendAndRender(childView);
      this.view.floatingChildren.push(childView.children.at(0)!);
    } else if (childView.isDialog() && this.view !== HTMLDelegate.dialogLayer) {
      HTMLDelegate.dialogLayer.appendAndRender(childView);
    } else if (childView.options.toastStack && this.view !== HTMLDelegate.toastLayer) {
      childView.referenceView = this.view;
      HTMLDelegate.toastLayer.appendAndRender(childView);
    } else {
      this.view.addChild(childView);
      this.options.afterAppendChild?.(this.view, childView);
    }
  }
  adjustOptions(): void {
    //expandOptionBundles(this.options);
    if (this.options.elevation) {
      this.options.filter = atom(() => dropShadowForElevation(zget(this.options.elevation)));
    }
    this.options.borderRadius ??= this.options.rounding;
    if (this.options.resize) {
      // overflow needs to be set to something other than 'visible' for resize to have an effect
      this.options.overflow ??= "auto";
    }
    if (this.options.scale) {
      this.options.transform = `scale(${zget(this.options.scale)})`;
    }
    if (this.options.controlSize) {
      this.options.fontSize = pct(100 * controlSizeFactors[controlSizes.indexOf(this.options.controlSize)]);
    }
  }
  extractHTMLAttributes(options: HTMLOptions): Attributes {
    // convert numbers to strings
    const validOptions = Object.entries(options)
      .filter(([key, value]) => value !== undefined && htmlAttributeKeys.includes(key))
      .map(([key, value]) => [key, typeof value === "number" ? value.toString() : value]);
    return Object.fromEntries(validOptions);
  }
  public htmlAttributes(): Attributes {
    return this.extractHTMLAttributes(this.options);
  }

  public htmlAttributeSummary(): string {
    let summary = "";
    Object.entries(this.htmlAttributes()).forEach(([key, value]) => {
      if (value !== undefined) {
        summary += `  ${key}: ${value}\n`;
      }
    });
    return summary ? "\nhtml properties:\n" + summary : "";
  }

  extractCSSAttributes(options: ViewOptions | CSSAttributeOptions): Attributes {
    const validOptions = Object.entries(options).filter(
      ([key, value]) => (value === 0 || value) && cssOptionKeys.includes(key)
    );
    return Object.fromEntries(validOptions);
  }

  // TODO: why is selection given this special treatment??
  selectionAttributes(): Attributes {
    let color = this.options.color;
    let background = this.options.background;
    const selColor = this.options.selectionColor;

    const textColor = this.options.selectionTextColor;
    if (textColor) {
      color = atom(() => (this.view.isSelected() ? zget(textColor) : zget(this.options.color!)));
    } else if (this.options.selected && color && selColor instanceof ColorToken) {
      color = atom(() => (this.view.isSelected() ? selColor.contrast : zget(this.options.color!)));
    }
    if (this.options.selected && background && selColor) {
      background = atom(() => (this.view.isSelected() ? zget(selColor) : zget(this.options.background!)));
    }
    return { color, background };
  }

  public cssAttributes(): Attributes {
    return { ...this.extractCSSAttributes(this.options), ...this.selectionAttributes() };
  }

  public getSheetStack(): OptionSheet[] {
    return sheetStack;
  }
  public getAllSheets(): OptionSheet[] {
    return allSheets;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////

defineComponentBundle<HTMLOptions>("HTML", "", {
  color: core.color.primary,
  cursor: "default",
  userSelect: "none",
});

export function HTML(inOptions: BV<HTMLOptions> = {}): View {
  const options = mergeComponentOptions("HTML", inOptions);

  return restoreOptions(new View(new HTMLDelegate(), options));
}

////////////////////////////////////////////////////////////////////////////////////////////

function HTMLBody(): View {
  const options: HTMLOptions = {
    id: "_body",
    componentName: "_body",
    background: core.color.background,
    position: "relative",
    font: core.font.body_medium,
    afterAppendChild(view: View, _child: View): void {
      const transparentViews = view.children.filter(
        (v) => v.options.name === "FloatingLayer" || v.options.name === "DialogLayer"
      );
      const otherViews = view.children.filter((v) => !transparentViews.includes(v));
      view.children.set([...otherViews, ...transparentViews]);
    },
  };
  beforeAddedToDOM(options, (view: View): void => {
    view.setParent(View.rootView);
  });

  return HTML(options);
}

////////////////////////////////////////////////////////////////////////////////////////////

interface ViewOverlayOptions extends HTMLOptions {}

defineComponentBundle<ViewOverlayOptions>("Overlay", "HTML", {
  background: core.color.transparent,
  position: "absolute",
  left: px(0),
  top: px(0),
  width: pct(100),
  height: pct(100),
  pointerEvents: "none",
  zIndex: 1,
  borderRadius: "inherit",
});

export function ViewOverlay(inOptions: BV<ViewOverlayOptions> = {}): View {
  const options = mergeComponentOptions("Overlay", inOptions);
  return restoreOptions(HTML(options));
}

////////////////////////////////////////////////////////////////////////////////////////////

const defaultScreenOverlayOptions: HTMLOptions = {
  position: "absolute",
  left: px(0),
  top: px(0),
  width: vw(100),
  height: vh(100),
  pointerEvents: "none",
  overflow: "hidden",
  background: core.color.transparent,
};

function FloatingLayer(): View {
  const options: HTMLOptions = {
    ...defaultScreenOverlayOptions,
    id: "_floatingLayer",
    name: "FloatingLayer",
    zIndex: 90,
    afterAppendChild: (_view: View, childView: View): void => {
      (<HTMLOptions>childView.options).position = "absolute";
    },
  };
  const layer = HTML(options);
  View.bodyView.appendAndRender(layer);
  return layer;
}

////////////////////////////////////////////////////////////////////////////////////////////

function DialogLayer(): View {
  const options: HTMLOptions = {
    ...defaultScreenOverlayOptions,
    id: "_dialogLayer",
    name: "DialogLayer",
    zIndex: 100,
    afterAppendChild: (view: View, childView: View): void => {
      const options = <HTMLOptions>childView.options;
      options.position = "absolute";
      options.placement = place.center;
    },
  };
  beforeAddedToDOM(options, (view: View): void => {
    const options = <HTMLOptions>view.options;
    options.background = atom(() => (view.hasVisibleChild() ? core.color.scrim.opacity(0.2) : core.color.transparent));
  });

  const layer = HTML(options);
  View.bodyView.appendAndRender(layer);
  return layer;
}

////////////////////////////////////////////////////////////////////////////////////////////

function ToastLayer(): View {
  const options: HTMLOptions = {
    ...defaultScreenOverlayOptions,
    id: "_toastLayer",
    name: "ToastLayer",
    zIndex: 100,
  };
  const layer = HTML(options);
  View.bodyView.appendAndRender(layer);
  return layer;
}

////////////////////////////////////////////////////////////////////////////////////////////

Object.entries(core.space).forEach(([key, val]) => {
  defineBundle<HTMLOptions>(`gap-${key[1]}`, { gap: val });
  defineBundle<HTMLOptions>(`pad-${key[1]}`, { padding: val });
});
Object.entries(core.rounding)
  .slice(0, -1)
  .forEach(([key, val]) => defineBundle<HTMLOptions>(key, { rounding: val }));
defineBundle<HTMLOptions>("b0", { border: core.border.none });
defineBundle<HTMLOptions>("b1", { border: core.border.thin });
defineBundle<HTMLOptions>("b2", { border: core.border.medium });
defineBundle<HTMLOptions>("b3", { border: core.border.thick });

Object.entries(core.color).forEach(([key, val]) => {
  defineBundle<HTMLOptions>(`bg-${key}`, { background: val });
  defineBundle<HTMLOptions>(`c-${key}`, { color: val });
});

Object.entries(core.font).forEach(([key, val]) => {
  const key2 = key
    .split("_")
    .map((p) => p.at(0))
    .join("");
  defineBundle<HTMLOptions>(`f-${key2}`, { font: val });
});

const textAlignments: [string, css_textAlign][] = [
  ["s", "start"],
  ["e", "end"],
  ["l", "left"],
  ["r", "right"],
  ["c", "center"],
  ["j", "justify"],
  ["m", "match-parent"],
  ["ja", "justify-all"],
];
textAlignments.forEach(([abbr, align]) => defineBundle<HTMLOptions>(`ta-${abbr}`, { textAlign: align }));
