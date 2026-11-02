import { Box, ch, gradientY, zborder, zcolor } from "zaffre";

export const GradientYExample = () => {
    return Box({
        height: ch(20),
        width: ch(20),
        border: zborder.thin,
        background: gradientY(zcolor.primary, zcolor.yellow)
    });
}

