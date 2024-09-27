import { atom, zget, Rect2D, ArrayAtom, arrayAtom } from ":foundation";
import { place, View, em, core, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { Floating } from "../HTML";
import { Stack, StackOptions } from "../Layout";
import { SimpleMenu } from "../Floating";
import { Button } from "../Controls";

//
// A Toolbar is a responsive stack of buttons which collapses to a single menu button when
// there is not enough space to show all of the buttons.
//
// The toolbar itself is created with only a hidden menu button. The other buttons are expected
// to be appended to this view. We capture the children as they are appended here, and add a
// hidden option to each one that we can control from here. From this list of buttons, we construct
// a menu using the tooltips and actions of the buttons. When the combined widths of the buttons exceeds 
// the width of the view, the menu is shown and the buttons are hidden.
// 
// TODO: only works for horizontal toolbars currently (threshold is based on width)
// Q: could we use a resizeAction instead of onResize?
//

export interface ToolbarOptions extends StackOptions {
  menuIconName?: string;
}
defineComponentDefaults<ToolbarOptions>("Toolbar", "Stack", {
  flexDirection: "row",
  justifyContent: "start",
  height: em(1.5),
  alignItems: "center",
  borderBottom: core.border.thin,
  padding: core.space.s2,
  menuIconName: "icon.show-menu",
  overflow: "hidden"
});

export function Toolbar(inOptions: ToolbarOptions = {}): View {
  const options = mergeComponentDefaults("Toolbar", inOptions);

  const collapsed = atom(false);

  // compute total button width on a resize
  let buttonsWidth = 0;
  function barResized(bar: View): void {
    if (!collapsed.get()) {
      buttonsWidth = Rect2D.union(bar.children.filter((k) => k !== menuButton).map((b) => b.clientRect())).width;
      if (bar.width < buttonsWidth) {
        bar.disableResizeObserverWhile(() => collapsed.set(true));
      }
    } else if (bar.width > buttonsWidth) {
      bar.disableResizeObserverWhile(() => collapsed.set(false));
    }
  }
  options.onResize = (view: View): void => barResized(view);

  // gather the buttons as they are added and apply a hidden atom
  const buttons: ArrayAtom<View> = arrayAtom([]);
  options.afterAppendChild = (_view, child): void => {
    if (child !== menuButton) {
      child.options.hidden = collapsed;
      buttons.push(child);
    }
  };

  // create the menu
  const menuChoice = atom<View | undefined>(undefined, { action: (button) => button.options.action?.() });
  const menuButton = Button({
    background: core.color.primaryContainer,
    font: core.font.title_medium,
    border: core.border.none,
    leadingIconURI: "icon.show-menu",
    hidden: atom(() => !collapsed.get()),
  });
  menuButton.append(Floating(SimpleMenu(menuChoice, buttons, (button) => zget(button?.options.tooltip) || ""), { placement: place.bottom }));

  return Stack(options).append(menuButton);
}
