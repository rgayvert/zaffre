import { atom, PickList, point2D } from ":foundation";
import { addClass, afterOptionsMerged } from ":view";
import { px } from ":attributes";
import { TextButton, ButtonOptions } from "../Controls";
import { Box } from "../HTML";
import { SegmentedButton, SegmentedButtonOptions } from "./SegmentedButton";

//
// SegmentedTextButton: a SegmentedButton that uses simple text buttons, with no backgound or border.
//

export const SegmentedTextButton = <T>(list: PickList<T>, inOptions: SegmentedButtonOptions<T> = {}) => {
  const options = addClass(inOptions, "SegmentedTextButton");
  options.model = list;

  afterOptionsMerged(options, (view) => {
    const selectionSegmentOffset = atom(point2D(0, 0));
    const selectionSegmentWidth = atom(0);
    const selectionSegmentTransition = atom("");
    const updateSelectionSegment = () => {
      const w = view.width / list.values.length;
      const idx = list.selectedIndex();
      if (idx === -1) {
        selectionSegmentWidth.set(0);
      } else {
        const btn = view.children.at(idx);
        if (btn) {
          const r = btn.rectInParent();
          selectionSegmentOffset.set(point2D(r.left, r.bottom - 2));
          selectionSegmentWidth.set(r.width);
          setTimeout(() => selectionSegmentTransition.set("0.3s"), 300);
        }
      }
    };
    const SelectionSegment = () => {
      return Box({
        cls: "SegmentedTextButton.SelectionSegment",
        left: () => px(selectionSegmentOffset.get().x),
        top: () => px(selectionSegmentOffset.get().y),
        width: () => px(selectionSegmentWidth.get()),
        transition: () => selectionSegmentTransition.get(),
      });
    };
    view.addResizeAction(() => updateSelectionSegment());
    list.addAction(() => updateSelectionSegment());

    view.append(SelectionSegment());
  });

  const SegmentTextButton = (options: ButtonOptions) => {
    return TextButton(options.label || "", options);
  };

  return SegmentedButton(list, {
    ...options,
    buttonCreator: SegmentTextButton,
  });
};
