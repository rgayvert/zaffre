import { em, pct, px, rem } from ":attributes";
import { coreColorEffect, zborder, zcolor, zfont, zrounding, zspace } from ":theme";
import {
  BulletListOptions,
  ButtonOptions,
  CardOptions,
  CarouselOptions,
  EnsembleOptions,
  ImageBoxOptions,
  TextBoxOptions,
} from ":components";

export const baseRules = {
  "Autocomplete": {
    "Autocomplete": {
      border: zborder.thin,
      rounding: zrounding.r2,
      padding: zspace.s2,
    },
    "Autocomplete.Input": {
      border: zborder.none,
    },
    "Autocomplete.Close": {
      leadingIconURI: "icon.close",
      border: zborder.none,
      controlSize: "lg",
      preserveFocus: true,
    } satisfies ButtonOptions,
    "Autocomplete.Toggle": {
      leadingIconURI: "icon.chevron-down",
      border: zborder.none,
      controlSize: "lg",
    } satisfies ButtonOptions,
    "Autocomplete.ListBox": {
      background: zcolor.background,
    },
  },
  "BulletList": {
    "BulletList": {
      bullets: "∙◦-+",
      showRoot: false,
      alignItems: "start",
      alwaysExpanded: true,
    } satisfies BulletListOptions,
  },
  "Card": {
    "Card": {
      border: zborder.thin,
      overflow: "hidden",
    } satisfies CardOptions,
    "Card.Title": {
      font: zfont.title_medium,
      color: zcolor.primary,
      padding: zspace.s2,
    } satisfies TextBoxOptions,
    "Card.Subtitle": {
      font: zfont.body_medium,
      color: zcolor.primary,
    } satisfies TextBoxOptions,
    "Card.Body": {
      font: zfont.body_medium,
      color: zcolor.primary,
      padding: zspace.s2,
    } satisfies TextBoxOptions,
    "Card.Image": {
      maxWidth: pct(100),
    } satisfies ImageBoxOptions,
  },
  "Carousel": {
    "Carousel": {
      flexDirection: "row",
      gap: zspace.s0,
      intervalMillis: 0,
    } satisfies CarouselOptions,
    "Carousel.CarouselButton": {
      color: zcolor.primaryContainer,
      font: zfont.display_medium,
      border: zborder.none,
      effects: {
        hovered: coreColorEffect(zcolor.primary),
      },
    },
    "Carousel.LeftButton": {
      leadingIconURI: "icon.chevron-left",
    } satisfies ButtonOptions,

    "Carousel.Ensemble": {} satisfies EnsembleOptions<string>,

    "Carousel.RightButton": {
      leadingIconURI: "icon.chevron-right",
    } satisfies ButtonOptions,
  },

  "Input": {
    Input: {
      height: em(2.75),
      border: zborder.thin.color(zcolor.gray.tone(30)),
      fontFamily: "inherit",
      fontSize: rem(1),
      fontWeight: 500,
      backgroundColor: zcolor.transparent,
      color: zcolor.gray.tone(90),
      focus: {
        outline: zborder.medium.color(zcolor.blue.tone(80)),
        outlineOffset: px(-1),
      },
    },
  },
};
