import { atom, incrementAtom, decrementAtom, point2D, zset, Point2D, zboolean, Atom } from ":foundation";
import { View, beforeAddedToDOM, ZWindow, getViewFromZaffreData, addClass } from ":core";
import { Box, BoxOptions } from "./Box";

//
// A Floating component wraps around another component so that it can be placed
// in either the Floating or Dialog layer.
//
// There are three main issues here:
//   - when does it appear? (reference click / hover / reactive trigger)
//   - how do we respond to keystrokes/clicks when it's up
//   - when does it hide?
//
// TODO:
//  - add support for bubble arrows

export interface FloatingContainerOptions extends BoxOptions {
  useArrow?: boolean;
  dismissOnOutsideClick?: boolean;
  dismissOnEscape?: boolean;
  clickThrough?: boolean; // should outside click be propagated?
  showAt?: Atom<Point2D | undefined>;
  hideOnWindowResize?: zboolean;
}

export interface DialogContainerOptions extends FloatingContainerOptions {}

export const floatingCount = atom(0);

/**
 * When we make a view floating, we move the following view options to the floating container:
 *    placement, effects, elevation
 * The floating container has a hidden atom that is usually created here, but may come in with the view.
 * The hidden atom of the view is set to be that of the floating container.
 */

export const FloatingContainer = (inOptions: FloatingContainerOptions = {}) => {
  const options = addClass(inOptions, "FloatingContainer");

  options.floating ??= true;
  options.zIndex = 100;
  options.pointerEvents = "auto"; // override setting in floating layer parent
  options.elevation ??= 1;

  options.hidden ??= atom(true);
  options.model = [options.hidden];
  let view: View;

  beforeAddedToDOM(options, (v: View): void => {
    view = v;
    v.addIntersectionAction((visible) => visibilityChanged(visible));
  });

  if (options.hideOnWindowResize) {
    ZWindow.instance.addWindowResizeAction(() => zset(options.hidden, true));
  }

  const windowClickHandler = (evt: MouseEvent): void => handleWindowClick(evt);
  const handleWindowClick = (event: MouseEvent): void => {
    if (view) {
      const firstChild = view.children.at(0)!;
      const targetView = event.target instanceof Element ? getViewFromZaffreData(event.target) : undefined;
      const isClickOnFloatingElement = targetView?.hasFloatingAncestor();

      if (!firstChild.clientRect().containsPoint(point2D(event.clientX, event.clientY))) {
        if ((!options.isDialog || options.dismissOnOutsideClick) && !isClickOnFloatingElement) {
          //zset(options.hidden, true);
          view.hide();
        }
        if (!options.clickThrough) {
         //event.stopPropagation();
        }
      }
    }
  };
  const windowKeyDownHandler = (evt: KeyboardEvent): void => handleWindowKeyDown(evt);
  const handleWindowKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      zset(options.hidden, true);
      event.stopPropagation();
    }
  };
  const pointerOverHandler = (evt: PointerEvent): void => handlePointerOver(evt);
  const handlePointerOver = (event: PointerEvent): void => {
    if (!view.elt.contains(<Node>event.target) && !options.clickThrough) {
      event.stopPropagation();
    }
  };

  // Use a capturing event listener on the document to catch clicks outside this element

  const visibilityChanged = (visible: boolean): void => {
    if (visible) {
      incrementAtom(floatingCount);
      document.addEventListener("click", windowClickHandler, true);
      document.addEventListener("keydown", windowKeyDownHandler, true);
      document.addEventListener("pointerover", pointerOverHandler, true);
    } else {
      decrementAtom(floatingCount);
      document.removeEventListener("click", windowClickHandler, true);
      document.removeEventListener("keydown", windowKeyDownHandler, true);
      document.removeEventListener("pointerover", pointerOverHandler, true);
    }
  };

  return Box(options);
};

export const DialogContainer = (inOptions: DialogContainerOptions = {}) => {
  const options = addClass(inOptions, "DialogContainer");
  options.isDialog = true;
  options.floating = false;

  return FloatingContainer(options);
};
