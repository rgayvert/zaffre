import { ch, em, flexToken, pct, px, rem } from "zaffre";
import { zborder, zcolor, zfont, zrounding, zspace } from "zaffre";

export const galleryDefaults = {
  ColorSelector: {
    gap: zspace.s5,
  },
  "ColorSelector>VStack": {
    gap: zspace.s2,
    padding: zspace.s2,
  },
  "ColorSelector>Slider": {
    minVal: 0,
    maxVal: 255,
    round: true,
    width: ch(15),
    radiusRatio: 20,
    knobColor: zcolor.red,
  },
  "ColorSelector>CenterBox": {
    height: em(8),
    width: em(8),
  },
  "ColorSelector>TextInput": {
    textTransform: "lowercase",
    width: ch(8),
  },
  ColorSelector_ColorBox: {
    position: "absolute",
    border: zborder.thin,
    padding: zspace.s2,
    height: pct(100),
    width: pct(100),
  },
  "ColorSelector>ColorInput": {
    opacity: 0,
    width: pct(100),
    height: pct(100),
  },

  ColorSpaceGrid: {
    nrows: 4,
    border: zborder.thin,
    background: zcolor.lightgray,
    gap: px(1),
    gridAutoFlow: "column",
  },

  ColorSpaceGrid_Space: {
    padding: zspace.s3,
    background: zcolor.background,
  },

  ColorSpaceGrid_Desc: {
    padding: zspace.s3,
    background: zcolor.background,
    font: zfont.label_large,
  },

  "GalleryDemo": {
    gap: em(1),
    width: pct(100),
    alignItems: "center",
    justifyContent: "start",
    marginBottom: zspace.s5,
  },

    "GallerySettings": {

  },
  "GallerySettings>TextLabel": {
    background: zcolor.inherit,
    font: zfont.label_large,
    border: zborder.none,
  },
  "GallerySettings>Form": {
    templateColumns: "auto 1fr",
  },

  GalleryTree: {
    minHeight: pct(100),
    flex: flexToken({ grow: 0, shrink: 0, basis: ch(22) }),
    border: zborder.none,
    borderRight: zborder.medium,
    paddingLeft: zspace.s2,
    paddingTop: zspace.s3,
    overflowX: "hidden",
    overflowY: "auto",
    alignItems: "start",
    includeInfo: true,
  },

  "GalleryTree>TextLabel": {
    width: pct(100),
    font: zfont.label_large,
    //padding: zspace.s2,
    background: zcolor.primaryContainer,
  },

  "GalleryTree>SimpleTree": {
    font: zfont.title_medium,
    width: pct(100),
    height: pct(100),
    flex: flexToken({ grow: 1 }),
    border: zborder.none,
    iconSide: "right",
    showRoot: false,
  },

    "Markdown": {
    extraClasses: "markdown-body",
    background: zcolor.background,
    minHeight: em(1.2),
    padding: zspace.s3,
    userSelect: "text",
    expandRelativeAssets: true,
    darkModeSuffix: "_dark",
  },

  ThemeColorsGrid: {
    nrows: 0,
    ncolumns: 4,
    gap: zspace.s2,
    width: pct(100),
  },
  "ThemeColorsGrid>CenteredText": {
    minWidth: ch(15),
    minHeight: ch(6),
    font: zfont.body_small,
    border: zborder.thin,
  },

  ThemeSelector: {
    alignItems: "center",
    gap: zspace.s5,
  },
  "ThemeSelector>SegmentedButton": {
    rounding: zrounding.none,
    font: zfont.body_small,
  },
  "ThemeSelector>Slider": {
    minVal: 1.0,
    maxVal: 21.0,
  },

  VideoPlayerOverlay: {
    background: zcolor.transparent,
    outline: "none",
    position: "absolute",
    top: px(0),
  },

  YouTubeIFrame: {
    controls: true,
    disableKeyboard: true,
    allowFullscreen: false,
    border: zborder.thin,
  },
};
