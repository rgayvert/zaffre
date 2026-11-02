import { atom, zget, Rect2D, arrayAtom, SimpleAction, pickList } from ":foundation";
import { addClass, View } from ":core";
import { Stack, StackOptions } from "../Layout";
import { MenuButton, simpleMenuItemList } from "../Floating";
import { ButtonOptions, buttonSpec } from "../Controls";

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
// Note: this component initially contains only the menu button; other buttons must be added by the client
//

export interface ToolbarOptions extends StackOptions {}

export const Toolbar = (inOptions: ToolbarOptions = {}) => {
  const options = addClass(inOptions, "Toolbar");
  const collapsed = atom(false);

  // gather the buttons as they are added and apply a hidden atom
  const buttons = arrayAtom<View>([]);
  options.afterAppendChild = (_view, child): void => {
    if (child !== menuButton) {
      child.options.hidden = collapsed;
      buttons.push(child);
    }
  };

  // compute total button width on a resize
  let buttonsWidth = 0;
  const barResized = (bar: View): void => {
    if (!collapsed.get()) {
      buttonsWidth = Rect2D.union(bar.children.filter((k) => k !== menuButton).map((b) => b.clientRect())).width;
      if (bar.width < buttonsWidth) {
        bar.disableResizeObserverWhile(() => collapsed.set(true));
      }
    } else if (bar.width > buttonsWidth) {
      bar.disableResizeObserverWhile(() => collapsed.set(false));
    }
  };
  options.onResize = (view): void => barResized(view);

  // create the menu
  const selectedButton = atom<View | null>(null);
  const buttonList = simpleMenuItemList(buttons, selectedButton, (button) => zget(button?.options.tooltip) || "");
  selectedButton.addAction((button) => button && (<ButtonOptions>button?.options).action?.());
  const menuButton = MenuButton(buttonList, {
    name: "Toolbar.MenuButton",
    hidden: () => !collapsed.get(),
  });

  return Stack(options).append(menuButton);
};

export const TToolbar = <T extends string>(
  icons: Record<T, string>,
  actions: Record<T, SimpleAction>,
  options: ToolbarOptions = {},
) => {
  const buttons = Object.keys(icons).map((key) =>
    buttonSpec()
      .tooltip(key)
      .action(actions[key as T])
      .leadingIconURI(icons[key as T])
      .build(),
  );

  return Toolbar(options).append(...buttons);
};
