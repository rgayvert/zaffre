import { Resettable, VStack, counterAtom, zspace, zborder, addClass, atom, afterOptionsMerged } from "zaffre";
import { pct, zutil } from "zaffre";
import { GalleryTopic, GallerySection } from "../GalleryTypes";
import { DemoBoxHeader } from "./DemoBoxHeader";
import { DemoBoxEnsemble, DemoBoxViewType } from "./DemoBoxEnsemble";
import { DemoBoxOptions, demoBoxRules } from "./DemoBox.rules";

/**
 * #DemoBox
 *   - standard box used for all demo examples
 *   - contains an ensemble controlled by a segmented button with Demo, Notes, Source, and DOM
 *   - resettable wrapper forces the example to be reloaded when the reset button is clicked
 *   - if the demo has only one section, it is considered "fullpage"; otherwise, space is added around the sections
 *
 */

export interface DemoBoxModel {
  section: GallerySection;
  topic: GalleryTopic;
}

export const DemoBox = (model: DemoBoxModel, inOptions: DemoBoxOptions = {}) => {
  const options = addClass(inOptions, "DemoBox", demoBoxRules);
  options.model = model;

  afterOptionsMerged(options, (view) => {
    const { section, topic } = model;
    options.id = zutil.stripWhitespace(section.title);
    const fullPage = topic.sections.length === 1;
    if (fullPage) {
      options.border = zborder.none;
      options.marginTop = zspace.s0;
    }
    options.justifyContent = undefined;
    options.overflow = undefined;
    const viewKey = atom<DemoBoxViewType>("demo");
    const resetCounter = counterAtom(0);
    const demoContainer = Resettable(section.componentFn, resetCounter);
    const header = DemoBoxHeader(section, viewKey, resetCounter);
    const ensemble = DemoBoxEnsemble(demoContainer, section, topic, viewKey, fullPage);

    options.width = fullPage ? pct(100) : pct(95);
    if (fullPage) {
      options.height = pct(100);
    }
    if (fullPage) {
      view.append(header, ensemble);
    } else {
      view.append(header, demoContainer, ensemble);
    }
  });
  return VStack(options);
};
