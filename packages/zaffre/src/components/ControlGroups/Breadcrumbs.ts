import { arrayAtom, ArrayAtom, BasicAction, getTextWidth, ZArray, zboolean, zget, zstring, zutil } from ":foundation";
import { HStack, StackOptions, ViewList } from "../Layout";
import { addClass, afterOptionsMerged, View } from ":view";
import { TextLabel, Link } from "../Content";
import { TextButton } from "../Controls";

//
// A Breadcrumbs component is a horizontal stack of labeled urls
//

export interface BreadcrumbsOptions extends StackOptions {
  truncateLeadingCrumbs?: zboolean;
}

export type Breadcrumb = {
  value: zstring;
  label?: zstring;
  url?: string;
  action?: BasicAction;
};
const breadcrumbLabel = (crumb: Breadcrumb) => crumb.label || crumb.value;
const breadcrumbWidth = (crumb: Breadcrumb) => getTextWidth(zget(breadcrumbLabel(crumb)), "bold 13px Arial")

export const Breadcrumbs = <T extends string>(crumbs: ArrayAtom<Breadcrumb>, inOptions: BreadcrumbsOptions = {}) => {
  const options = addClass(inOptions, "Breadcrumbs");
  options.model = crumbs;

  const parts = arrayAtom<Breadcrumb>([]);
  crumbs.addAction(() => updateParts());
  let crumbView: View;
  
  const updateParts = (): void => {
    if (crumbView) {
      // build parts list from the right s.t. the result fits in the view
      const list: Breadcrumb[] = [crumbs.at(-1)!];
      let sum = breadcrumbWidth(list[0]);
      const viewWidth = crumbView.parent?.width || 1000;
      const sepWidth = breadcrumbWidth({ value: ">" }) + 12;

      for (let i = crumbs.length - 2; i >= 0; i--) {
        const crumb = crumbs.at(i)!;
        sum += breadcrumbWidth(crumb) + sepWidth;
        //console.log("crumb="+crumb.value+", sum="+sum+", w="+viewWidth);
        if (sum < viewWidth) {
          list.unshift({ value: ">" });
          list.unshift(crumb);
        }
      }
      parts.set(list);
      //console.log("list="+JSON.stringify(list));
    } 
  }

  afterOptionsMerged(options, (view) => {
    crumbView = view;
    view.addResizeAction(() => updateParts());
  });
  
  const createCrumbView = (crumb: Breadcrumb, index: number) => {
    //const last = index === parts.length - 1;
    //console.log("parts.length="+parts.length+",index=" + index + ",label=" + crumb.label + ", last=" + last+", xx="+(!!crumb.action && !last));
    return crumb.url
      ? Link(crumb.url, { text: crumb.label, cls: "Breadcrumbs.Link" })
      : !!crumb.action
        ? TextButton(breadcrumbLabel(crumb), { action: crumb.action, cls: "Breadcrumbs.Button" })
        : TextLabel(breadcrumbLabel(crumb), { cls: "Breadcrumbs.TextLabel" });
  };

  // NOTE: there is some weirdness here with determining the length of parts; if we don't turn off
  // the view list cache, the length is wrong

  return HStack(options).append(
    ViewList(
      parts,
      (crumb, index) => `${zget(crumb.value)}${index}`,
      (crumb, index) => createCrumbView(crumb, index),
      { noCache: true },
    ),
  );
};
