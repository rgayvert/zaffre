import { addClass, px, StackOptions, VStack, zspace } from "zaffre";
import { DemoBox } from "./DemoBox";
import { GalleryTopic } from "./GalleryTypes";

/**
 * #GalleryDemo
 *   - A group of examples for a particular topic; each example is contained in a DemoBox
 */

export interface GalleryDemoOptions extends StackOptions {}

export const GalleryDemo = (topic: GalleryTopic, inOptions: GalleryDemoOptions = {}) => {
  const options = addClass(inOptions, "GalleryDemo");
  options.model = topic;
  const fullPage = topic.sections.length === 1;
  options.padding = fullPage ? zspace.s0 : zspace.s3;
  options.maxWidth = fullPage ? undefined : px(1440);

  return VStack(options).append(...topic.sections.map((section) => DemoBox({ section, topic })));
};
