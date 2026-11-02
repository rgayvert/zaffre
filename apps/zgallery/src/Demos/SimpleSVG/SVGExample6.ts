import { SVG, SVGImageBox, px, zborder } from "zaffre";

export const SVGExample6 = () => {
  return SVG({ width: px(300), height: px(200), border: zborder.thin }).append(
    SVGImageBox("image.flowers", { width: 300, height: 200 })
  );
}
