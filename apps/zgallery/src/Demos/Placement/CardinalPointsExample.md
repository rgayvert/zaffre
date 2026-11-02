
Here we show how placement can be done reactively. The red box is placed so that its center (xcenter-ycenter) is matched to the cardinal point closest to the cursor. A simple transition is used to make the box move smoothly.

This example also shows how you can get access to the underlying view if you really need it. The function beforeAddedToDOM() adds a callback to the options passed to a component. This callback includes the view as an argument. In this case we store the view and reference it in the refPt atom.