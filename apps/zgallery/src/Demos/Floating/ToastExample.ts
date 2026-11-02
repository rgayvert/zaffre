import { Button, HStack, point2D, ToastButton, ToastStack, indexedArrayAtom, zspace, zlog } from "zaffre";

export const ToastExample = () => {
  const toastItems = indexedArrayAtom<string>([], { maxLength: 4 });

  const addToast = () => {
    toastItems.addValue("hey now");

    zlog.info("toastItems="+toastItems.get());
  }

  return HStack({ gap: zspace.s6 }).append(
    ToastButton("Hey now", { label: "Simple" }),
    Button({ label: "Click to win", action: () => addToast() }).append(
      ToastStack(toastItems, {
        placement: { referencePt: "xend-ystart", offset: point2D(100, 50) },
        maxItems: 1,
        duration: 1500,
      })
    )
  );
}
