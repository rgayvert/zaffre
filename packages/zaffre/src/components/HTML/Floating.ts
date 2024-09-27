import { atom, Atom, incrementAtom, decrementAtom, zutil, zboolean } from ":foundation";
import { HTMLOptions, css, View, beforeAddedToDOM, core } from ":core";
import { defineComponentDefaults, mergeComponentDefaults } from ":core";
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

export interface FloatingOptions extends BoxOptions {
  useArrow?: boolean;
  dismissOnOutsideClick?: boolean;
  dismissOnEscape?: boolean;
  clickThrough?: boolean; // should outside click be propagated?
  showOnReferenceClick?: boolean;
  showOnReferenceHover?: boolean;
  showOn?: zboolean;
}
defineComponentDefaults<FloatingOptions>("Floating", "Box", {
  background: core.color.transparent,
  useArrow: false,
  dismissOnOutsideClick: true,
  dismissOnEscape: true,
  clickThrough: false,
  showOnReferenceClick: true, // TODO: turn this into a Handler on the reference
  width: "fit-content",
  position: "absolute",
  content: css("_"),
  floating: true,
  zIndex: 1000,
});

export const floatingCount = atom(0);

/**
 * When we make a view floating, we move the following view options to the floating container:
 *    place, placement, effects, elevation
 * The floating container has a hidden atom that is usually created here, but may come in with the view.
 * The hidden atom of the view is set to be that of the floating container.
 */

export function Floating(enclosedView: View, inOptions: FloatingOptions = {}): View {
  let options = mergeComponentDefaults("Floating", inOptions);
  const enclosedOptions = <HTMLOptions>enclosedView.options;

  options.name = enclosedOptions.componentName;

  options.elevation = 3;
  options = {
    ...options,
    ...zutil.extractOptions(enclosedOptions, ["place", "placement", "effects", "elevation"]),
  };
  options.hidden = enclosedOptions.hidden || atom(true);
  enclosedOptions.hidden = options.hidden;
  enclosedOptions.pointerEvents = "auto";
  enclosedOptions.elevation = 3;

  beforeAddedToDOM(options, (view: View): void => {
    view.addIntersectionAction((visible) => visibilityChanged(visible));
    if (options.showOnReferenceHover) {
      view.referenceView.options.needsPointerEvents = true;
    }
    if (options.placement) {
      if (options.placement instanceof Atom) {
        options.placement.addAction(() => view.place());
      }
      view.addResizeAction(() => view.place());
      view.addIntersectionAction(() => view.place());
    }
    if (options.showOnReferenceHover) {
      view.referenceView.options.needsPointerEvents = true;
      view.referenceView.iState("hovered").addAction(() => options.hidden?.set(false));
    } else if (options.showOnReferenceClick) {
      view.referenceView.addOptionEvents({ click: () => options.hidden?.set(false) });
    }
  });

  const windowClickHandler = (evt: MouseEvent): void => handleWindowClick(evt);
  function handleWindowClick(event: MouseEvent): void {
    if (!enclosedView.elt.contains(<Node>event.target)) {
      if (!enclosedView.isDialog()) {
        enclosedOptions.hidden?.set(true);
      }
      if (!options.clickThrough) {
        event.stopPropagation();
      }
    }
  }
  const windowKeyDownHandler = (evt: KeyboardEvent): void => handleWindowKeyDown(evt);
  function handleWindowKeyDown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      enclosedOptions.hidden?.set(true);
      event.stopPropagation();
    }
  }
  const pointerOverHandler = (evt: PointerEvent): void => handlePointerOver(evt);
  function handlePointerOver(event: PointerEvent): void {
    if (!enclosedView.elt.contains(<Node>event.target) && !options.clickThrough) {
      event.stopPropagation();
    }
  }

  // Use a capturing event listener on the document to catch clicks outside this element

  function visibilityChanged(visible: boolean): void {
    if (visible) {
      incrementAtom(floatingCount);
      document.addEventListener("click", windowClickHandler, true);
      document.addEventListener("keydown", windowKeyDownHandler, true);
      document.addEventListener("pointerover", pointerOverHandler, true);
      enclosedView.focus();
    } else {
      decrementAtom(floatingCount);
      document.removeEventListener("click", windowClickHandler, true);
      document.removeEventListener("keydown", windowKeyDownHandler, true);
      document.removeEventListener("pointerover", pointerOverHandler, true);
    }
  }

  return Box(options).append(enclosedView);
}
