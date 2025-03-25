import { atom, Atom, incrementAtom, decrementAtom, zutil, zboolean, Point2D, point2D } from ":foundation";
import { HTMLOptions, css, View, beforeAddedToDOM, core, ZWindow, BV, restoreOptions } from ":core";
import { defineComponentBundle, mergeComponentOptions } from ":core";
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
  toggleOnReferenceEnter?: boolean;
  showAt?: Atom<Point2D | undefined>;
  hideOnWindowResize?: zboolean;
}
defineComponentBundle<FloatingOptions>("Floating", "Box", {
  background: core.color.transparent,
  useArrow: false,
  dismissOnOutsideClick: true,
  dismissOnEscape: true,
  clickThrough: false,
  showOnReferenceClick: true, // TODO: turn this into a Handler on the reference
  //width: "fit-content",
  position: "absolute",
  content: css("_"),
  floating: true,
  zIndex: 1000,
  hideOnWindowResize: false,
});

export const floatingCount = atom(0);

/**
 * When we make a view floating, we move the following view options to the floating container:
 *    place, placement, effects, elevation
 * The floating container has a hidden atom that is usually created here, but may come in with the view.
 * The hidden atom of the view is set to be that of the floating container.
 */

export function Floating(enclosedView: View, inOptions: BV<FloatingOptions> = {}): View {
  let options = mergeComponentOptions("Floating", inOptions);
  const enclosedOptions = <HTMLOptions>enclosedView.options;

  options.name = enclosedOptions.componentName;

  // TODO: unclear whether elevation option is properly passed down
  options.elevation = 1;
  options = {
    ...options,
    ...zutil.extractOptions(enclosedOptions, ["place", "placement", "effects", "elevation"]),
  };
  options.hidden = enclosedOptions.hidden || atom(true);
  enclosedOptions.hidden = options.hidden;
  enclosedOptions.pointerEvents = "auto";
  enclosedOptions.elevation = options.elevation;
  //enclosedOptions.elevation = 3;

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
    if (options.toggleOnReferenceEnter) {
      view.addOptionEvents({
        keyDown: (evt) => {
          if (evt.key === "Enter" || evt.key === "Escape") {
            view.referenceView.focus();
          }
        }
      })
      view.referenceView.addOptionEvents({ keyDown: (evt) => {
        if (evt.key === "Enter") {
          options.hidden?.set(!options.hidden.get());
        }
      }});
    }
    if (options.hideOnWindowResize) {
      ZWindow.instance.addWindowResizeAction(() => options.hidden?.set(true));
    }
    if (options.showAt) {
      //options.placement = { referencePt: point2D(0, 0) }, 
      options.hidden?.addAction((b) => {
        b && options.showAt?.set(undefined);
      });
      options.showAt.addAction((pt) => {
        console.log("showing menu at "+pt!.toString());
        if (pt) {
          options.hidden?.set(false);
          //view.options.placement = { referencePt: pt };
          //view.place();
        } else {
          options.hidden?.set(true);
        }
      });
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

  return restoreOptions(Box(options).append(enclosedView));
}
