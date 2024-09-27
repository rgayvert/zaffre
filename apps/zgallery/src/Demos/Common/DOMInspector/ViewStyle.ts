import { View, zget, ZStyle } from "zaffre";
import { Atom } from ":foundation";

export function viewStyleText(selectedDOMView: Atom<View>): string {
  const view = selectedDOMView.get();
  if (view) {
    const cssText = view.elt.style.cssText.split("; ").join("\n  ");
    const eltStyle = `element.style {\n  ${cssText}\n}\n\n`;

    // touch the reactive attributes so that they will refresh in the viewer as they change
    view.attributeBundle.touchReactiveAttributes();

    const otherStyles = Array.from(view.elt.classList)
      .reverse()
      .map((clsName) => `${clsName} {\n${ZStyle.named(clsName)?.asRule(2) || ""}\n}\n`)
      .join("\n");
    const content = view.hasContent() ? `\nContent: "${zget(view.getContent())}"` : "";
    return `<pre>${eltStyle}${otherStyles}${content}${view.htmlAttributeSummary()}${view.svgAttributeSummary()}</pre>`;
  } else {
    return "";
  }
}
