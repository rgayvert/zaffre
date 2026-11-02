import { atom, zget, ZType, point2D } from ":foundation";
import { View, ChildCreator, ChildDataIDFn, VListOptions, addClass } from ":core";
import { Box } from "../HTML";
import { VStack } from "./Stack";
import { ViewList } from "./ViewList";

//
// Given a large data array, create a virtual scrolling list which creates only enough
// children to fill the list. This subset is updated when the container either scrolls or resizes.
// We use the scroll offset as an estimate of the items to display (it's not exact, but it should
// be sufficient for a large list). We assume that the items are roughly the same height, so we
// can get by with an estimate for the heights.
//

// TODO: make VirtualStack so that we always have access to a scroll view

export const VirtualList = <T>(
  data: ZType<ArrayLike<T>>,
  childDataID: ChildDataIDFn<T>,
  childCreator: ChildCreator<T>,
  inOptions: VListOptions<T> = {}
) => {
  const options = addClass(inOptions, "VirtualList");
  const listView = Box(options);

  let firstResize = true;
  let scrollView: View | undefined;
  let itemHeight = 20;
  let startIndex = 0;
  let nrows = 0;
  const currentData = atom(Array.prototype.slice.call(zget(data), 0, 0));
  const container = VStack({ cls: "VirtualList.Container" });

  // Get the height of the first item, and set the height of the listView; we don't need
  // an exact total height, since we only use an estimate.
  const estimateHeight = (container: View): void => {
    scrollView = container.parent?.parent;
    scrollView?.addEventListener("scroll", () => updateItems());

    currentData.set(Array.prototype.slice.call(zget(data), 0, 1));
    itemHeight = container.children.at(0)?.height || 20;
    listView.setMinHeight(itemHeight * zget(data).length);
  };
  options.onResize = (container: View): void => {
    if (firstResize) {
      firstResize = false;
      estimateHeight(container);
    }
    setTimeout(() => {
      updateItems();
    });
  };
  const updateItems = (): void => {
    const h = scrollView?.height || 0;
    const offset = scrollView?.elt.scrollTop || 0;
    const fraction = offset % itemHeight;
    nrows = Math.min(zget(data).length, Math.ceil(h / itemHeight) + 1);
    startIndex = Math.min(
      zget(data).length - nrows + 1,
      Math.floor(offset / itemHeight)
    );
    container.setHeight(h);
    currentData.set(
      Array.prototype.slice.call(zget(data), startIndex, startIndex + nrows)
    );
    container.setOffset(point2D(0, offset - fraction));
  };

  return listView.append(
    container.append(ViewList(currentData, childDataID, childCreator, options))
  );
};
