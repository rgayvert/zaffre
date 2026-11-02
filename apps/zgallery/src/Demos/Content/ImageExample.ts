import { pct, ImageBox, HStack, Box, zcolor, px, zspace, zborder, CenteredImageBox } from "zaffre";

export const ImageExample = () => {

  return HStack({ cls: "gap-s8" }).append(
    ImageBox("image.flowers", { width: pct(30) }),
    Box({ background: zcolor.lightgray, transform: "rotate(30deg)", padding: zspace.s3, display: "flex" }).append(
      ImageBox("image.flowers", { width: px(200) }),
    ),
    ImageBox("image.bad", { width: px(100) }),

  );

}
