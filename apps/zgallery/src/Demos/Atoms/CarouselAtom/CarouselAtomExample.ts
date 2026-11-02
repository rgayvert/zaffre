import { TextLabel, Button, HStack, addClass } from "zaffre";
import { carouselAtom } from "zaffre";
import { rules } from "./CarouselAtomExample.rules";

export const CarouselAtomExample = () => {
  const model = carouselAtom(["1", "2", "3", "4"], "2");
  const options = addClass({}, "CarouselAtom1", rules(model));

  return HStack(options).append(Button({ cls: "left-button" }), TextLabel(model), Button({ cls: "right-button" }));
};
