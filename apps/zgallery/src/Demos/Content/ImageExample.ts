import { View, pct, ImageBox } from "zaffre";

export function ImageExample(): View {
  return ImageBox("image.flowers", { width: pct(50) });
}
