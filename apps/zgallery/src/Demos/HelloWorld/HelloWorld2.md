Model-view design
  
Here we add more components and demonstrate how a model should be used to control a set of components.

Notes:
  - A button and a pair of switches are added.
  - An HStack is used to position the switches horizontally.
  - A custom font is applied to the text label. This value will not change with a theme change, or be responsive to window size.
  - A transition is added to the text label to make it fade in&out when the content changes.
  - The reactive values referenced by the views have been moved to an instance of a model class. The point is that all changes to the views are made by changing model values; you never directly  interact with a view once it is set up. This includes changes to content, attributes, and DOM structure.
  - The button is tied to the model via an *action*, which is a closure that calls a method on the model.
  - The reactive text value has been created using LocalData. This establishes a binding with a value in LocalData, so the value is automatically persisted whenever it changes (try reloading the page).
