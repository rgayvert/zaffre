A first component
  
This is a simple example which shows how a basic Zaffre *component* can be created and configured.
A component is just a function which return an opaque View, typically by composing other components.
The most basic HTML component is a Box, which gets translated into a \<div\> by the rendering process. 
HTML and CSS attributes are passed into a component function in an *options* object; this is always the
last parameter in the function.

If you examine the source, you will see that we return a Box with a TextLabel appended, and give each of
these components some attributes. In the DOM, you will see the HTML elements which are created, and the
styles that are generated for each of them.

Notes:
  - Box() and TextLabel() are standard Zaffre components, so each takes a collection of attributes and returns a View.
  - The name attribute is purely for debugging purposes, to make it easy to find a component in the DOM.
  - Composition is done with the *append()* method.
  - Attributes are often specified using *tokens*. A token is an object that combines with the current *theme* to construct
  HTML/CSS attributes. 
  - The *core* object contains a collection of predefined tokens for color, font, borders, space, and rounding. These are generally
  turned into CSS properties when rendered.
  - No external HTML or CSS files are needed for this component, since the DOM elements and styles are created dynamically.