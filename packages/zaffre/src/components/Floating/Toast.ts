import { zget, BasicAction, IndexedArrayAtom, znumber, zstring } from ":foundation";
import { TextLabel } from "../Content";
import { StackOptions, ViewList, VStack } from "../Layout";
import { addClass } from ":view";
import { BoxOptions } from "../HTML";
import { TransitionEffect } from ":effect";

//
// Toast and ToastStack
//
// A Toast is a floating component that hides itself after some amount of time (default is 1500ms), and
// stacks up when multiple instances are created. A component that wants to use Toast must add a ToastStack,
// which is a VStack that contains a reactive list of Toast items. When a toast needs to be displayed, it
// is added to the list of toast items. ToastStacks will appear in the global ToastLayer.
//

export interface ToastOptions extends BoxOptions {
  initialDelay?: znumber;
  duration?: znumber;
  message?: zstring;
}

export interface ToastStackOptions extends StackOptions {
  maxItems?: number;
  initialDelay?: number;
  duration?: number;
  mountEffect?: TransitionEffect;
  itemOptions?: ToastOptions;
}


export const Toast = (removalAction: BasicAction, message: string, inOptions: ToastOptions = {}) => {
  const options = addClass(inOptions, "Toast");

  const delta = zget(options.initialDelay || 0) + zget(options.duration || 1500);
  setTimeout(removalAction, delta);

  return TextLabel(message, options);
};

export const ToastStack = (toastItems: IndexedArrayAtom<string>, inOptions: ToastStackOptions = {}) => {
  const options = addClass(inOptions, "ToastStack");
  options.toastStack = true;

  return VStack(options).append(
    ViewList(
      toastItems,
      (dataItem) => dataItem.index,
      (dataItem) => Toast(() => toastItems.delete(dataItem), dataItem.value)
    )
  );
};
