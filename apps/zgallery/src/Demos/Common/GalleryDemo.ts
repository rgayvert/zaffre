import { View, VStack, core, StackOptions, pct, em, px, defineComponentDefaults, mergeComponentDefaults } from "zaffre";
import { DemoBox } from "./DemoBox"; 
import { GalleryTopic } from "./GalleryTypes";

/**
 * #GalleryDemo
 *   - A group of examples for a particular topic; each example is contained in a DemoBox
 */
interface GalleryDemoOptions extends StackOptions {}

defineComponentDefaults<GalleryDemoOptions>("GalleryDemo", "VStack", {
  gap: em(1),
  width: pct(100),
  alignItems: "center",
  justifyContent: "start",
  marginBottom: core.space.s5,
});

export function GalleryDemo(topic: GalleryTopic, inOptions: GalleryDemoOptions = {}): View {
  const options = mergeComponentDefaults("GalleryDemo", inOptions);
  const fullPage = topic.sections.length === 1;
  options.padding = fullPage ? core.space.s0 : core.space.s3;
  options.maxWidth = fullPage ? undefined : px(1440);

  return VStack(options).append(...topic.sections.map((section) => DemoBox(section, topic)));
}
