import { View, StackOptions, routeAtom, Resettable, VStack, counterAtom, BV, restoreOptions } from "zaffre";
import { core, pct, zutil } from "zaffre";
import { defineComponentBundle, mergeComponentOptions } from "zaffre";
import { GalleryTopic, GallerySection } from "../GalleryTypes";
import { DemoBoxHeader } from "./DemoBoxHeader";
import { DemoBoxEnsemble } from "./DemoBoxEnsemble";

interface DemoBoxOptions extends StackOptions {}

defineComponentBundle<DemoBoxOptions>("DemoBox", "VStack", {
  width: pct(95),
  marginTop: core.space.s3,
  border: core.border.thin.color(core.color.gray.opacity(0.5)),
});

/**
 * #DemoBox
 *   - standard box used for all demo examples
 *   - contains an ensemble controlled by a segmented button with Demo, Notes, Source, and DOM
 *   - resettable wrapper forces the example to be reloaded when the reset button is clicked
 *   - if the demo has only one section, it is considered "fullpage"; otherwise, space is added around the sections
 *
 */
export function DemoBox(section: GallerySection, topic: GalleryTopic, inOptions: BV<DemoBoxOptions> = {}): View {
  const options = mergeComponentOptions("DemoBox", inOptions);
  options.id = zutil.stripWhitespace(section.title);
  const fullPage = topic.sections.length === 1;
  if (fullPage) {
    options.border = undefined;
    options.marginTop = core.space.s0;
  }
  options.justifyContent = undefined;
  options.overflow = undefined;

  const viewKey = routeAtom(zutil.kebabize(section.title), "demo");
  const resetCounter = counterAtom(0);
  const demoContainer = Resettable(section.componentFn, resetCounter, {
    background: core.color.background,
  });
  const header = DemoBoxHeader(section, viewKey, resetCounter);
  const ensemble = DemoBoxEnsemble(demoContainer, section, topic, viewKey, fullPage);

  // TODO: domInspector does not update when demo is reset

  options.width = fullPage ? pct(100) : pct(95);
  if (fullPage) {
    options.height = pct(100);
  }
  return restoreOptions(
    fullPage ? VStack(options).append(header, ensemble) : VStack(options).append(header, demoContainer, ensemble)
  );
}
