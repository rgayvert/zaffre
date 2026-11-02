import { ImageBox, carouselAtom, lorem, zutil, Carousel, arrayAtom } from "zaffre";
import { transitions, atom, LabelBox, Checkbox, VStack, toggleAtom, Dots } from "zaffre";
import { carouselExampleRules } from "./CarouselExample.rules";


export const CarouselExample = () => {
  // some random images
  const imagePaths = zutil.sequence(0, 5).map((_idx) => lorem.image(400, 300));
  const effects = { hidden: transitions.fadeIn("in&out") };
  // ensemble key to control which image is displayed
  const key = carouselAtom(imagePaths, imagePaths[0], { circular: true, action: () => updateDots() });
  // timer atoms
  const interval = atom(0);
  const autoscroll = toggleAtom(false, { action: (b) => interval.set(b ? 3000 : 0) });
  // array of booleans, true only for current key
  const dots = arrayAtom(imagePaths.map((path) => path === key.get()));

  const updateDots = () => dots.set(imagePaths.map((path) => path === key.get()));


  const childCreator = (path: string) => ImageBox(path, { effects: effects });

  return VStack({ rules: carouselExampleRules }).append(
    Carousel(key, childCreator, {
      preloadList: imagePaths,
      intervalMillis: interval,
    }),
    Dots(dots),
    LabelBox("Scroll automatically").append(Checkbox(autoscroll))
  );
}
 