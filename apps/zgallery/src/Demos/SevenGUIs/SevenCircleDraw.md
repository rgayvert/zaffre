Task from https://eugenkiss.github.io/7guis/tasks/#circle<br>
Challenges: undo/redo, custom drawing, dialog control.

There are two main aspects of this task:
  - creating circle objects that can be selected and resized; and
  - tracking changes in with an undo manager

The UI contains an SVG box, buttons for undo/redo, and a slider to resize circles. The circles are implemented using SVGCircles which have a reactive radius and fill color, and respond to a click. These are maintained using a ViewList() of GCircle objects in the model.

Everything else is handled in the model. When the SVG area is clicked, the model is called with addCircleWithUndo(). This adds a GCircle to the reactive list of circles, which causes a new SVGCircle to be created. It also adds an undo action to the undoManager which will remove the circle from the list when performed (which in turn will remove the SVGCircle). 

The most interesting part here is the aggregation of resize operations. When a circle is selected and the slider dragged, the radius of the circle will change smoothly, so many undo operations will be added, although we want them to be undone as a single unit. To handle this, the slider has drag start/end actions to begin/end an undo group. This group goes onto the undo stack as a single operation.


Note: dialog control is mentioned in the challenges, but this is usually a bad idea, and not necessary here.