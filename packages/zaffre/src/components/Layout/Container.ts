import { View, addClass } from ":core";
import { Box, BoxOptions } from "../HTML";
import { Atom } from ":foundation";

//
// Container
//

export interface ContainerOptions extends BoxOptions {

} 

export const Container = (child: Atom<View | undefined>, inOptions: ContainerOptions = {}) => {
  const options = addClass(inOptions, "Container");

  const container = Box(options);
  container.append(child.get());
  
  child.addAction((view) => {
    const oldChild = container.childAt(0);
    const newChild = child.get();
    if (oldChild && newChild) {
      container.replaceChild(oldChild, newChild);
    } else if (newChild) { 
      if (newChild.rendered) {
        newChild.attach();
      } else {
        container.appendAndRender(newChild);
      }
    } else if (oldChild) {
      //container.removeChild(oldChild);
      oldChild.detach();
    }
  });

  return container;
};
