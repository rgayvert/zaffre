import { pct, ImageBox, HStack, Box, zcolor, px, zspace, zborder, CenteredImageBox } from "zaffre";

export const CenteredImageExample = () => {

  return HStack({ cls: "gap-s8" }).append(
    CenteredImageBox("image.flowers", { border: zborder.thin, width: px(200), height: px(200) })

    
  );

}
