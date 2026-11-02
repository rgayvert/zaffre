import { atom, Button, EmptyImageContent, HStack, ImageInput, trigger, zspace } from "zaffre";

export const ImageInputExample = () => {
  const url = atom(EmptyImageContent());
  const pickTrigger = trigger();
  return HStack({ gap: zspace.s8 }).append(
    ImageInput(url),
    HStack({ gap: zspace.s3 }).append(
      ImageInput(url, { trigger: pickTrigger }),
      Button({ label: "Set image", action: () => pickTrigger.set() }),
    ),
  );
};
