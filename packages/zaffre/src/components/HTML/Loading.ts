import { ImportAtom, zutil } from ":foundation";
import { View, ViewCreator, pct, beforeAddedToDOM } from ":core";
import { core, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { Box, BoxOptions } from "./Box";

//
// A Loading component works with an ImportAtom to dynamically import a component. When the
// import atom is set, it calls back to the Loading component with replaceWithImport(), and
// the Loading element is replaced with the new element.
//
// TODO:
//   - provide some feedback while the import is being retrieved
//   - display some kind of error message if the import fails
//

export interface LoadingOptions extends BoxOptions {
  delay?: number;
  timeout?: number;
}
defineComponentDefaults<LoadingOptions>("Loading", "Box", {
  timeout: 2000,
  width: pct(100),
  height: pct(100),
  background: core.color.secondaryContainer,
});

export function Loading(importComponent: ImportAtom<ViewCreator>, inOptions: LoadingOptions = {}): View {
  const options = mergeComponentDefaults("Loading", inOptions);

  function replaceWithImport(view: View, component: ViewCreator | undefined): void {
    const viewOptions = view.options;
    try {
      const newView = component?.({});
      if (newView) {
        newView.options.id = viewOptions.id;
        newView.options.hidden = viewOptions.hidden;
        newView.setParent(view.parent);
        view.parent?.renderChild(newView);
        view.parent?.replaceChild(view, newView);
      }
    } catch (e) {
      zutil.error("Error in replaceWithImport: " + e);
    }
  }

  beforeAddedToDOM(options, (view: View): void => {
    const component = importComponent.get();
    if (component) {
      //component has already arrived; wait a bit to allow this view to set up
      setTimeout(() => replaceWithImport(view, component), 100);
    } else {
      importComponent.addAction((component) => replaceWithImport(view, component));
    }
  });

  return Box(options);
}
