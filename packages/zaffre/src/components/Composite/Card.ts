import { zstring } from ":foundation";
import { View, css_font, css_space, css_color, pct } from ":core";
import { core, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { VStack, StackOptions } from "../Layout";
import { ImageBox, TextBox } from "../Content";

//
// A Card is a view that contains a set of standard pieces that can be assembled
// in a standard way (currently, just a vertical stack). A typical card will have a 
// title, subtitle, image, and body text.
// Nothing notable here, just a demonstration of how this can be done.
//
// TODO: support more assembly options

export interface CardOptions extends StackOptions {
  title?: zstring;
  titleFont?: css_font;
  subtitle?: zstring;
  subtitleFont?: css_font;
  body?: zstring;
  bodyFont?: css_font;
  titleSpace?: css_space;
  titleColor?: css_color;
  subtitleColor?: css_color;
  bodyColor?: css_color;
  imageSrc?: zstring;
}
defineComponentDefaults<CardOptions>("Card", "VStack", {
  titleFont: core.font.title_medium,
  titleSpace: core.space.s2,
  subtitleFont: core.font.body_medium,
  border: core.border.thin,
  overflow: "hidden",
});

export function Card(inOptions: CardOptions = {}): View {
  const options = mergeComponentDefaults("Card", inOptions);

  return VStack(options).append(
    options.imageSrc ? ImageBox(options.imageSrc, { width: pct(100), lazy: true }) : undefined,
    options.title ? TextBox(options.title, { id: "title", font: options.titleFont, color: options.titleColor }) : undefined,
    options.subtitle ? TextBox(options.subtitle, { id: "subtitle", font: options.subtitleFont, color: options.subtitleColor }) : undefined,
    options.body ? TextBox(options.body, { id: "body", color: options.bodyColor, padding: core.space.s2 }) : undefined
  );
}
