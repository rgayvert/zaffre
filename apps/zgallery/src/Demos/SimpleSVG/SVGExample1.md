This is a simple example showing an SVG component containing an SVGRectangle, SVGCircle, and SVGText. The parent of the SVG component here will be an HTML component (in the browser debugger, you will see a Resettable component). The rectangle, circle and text components may be added only to an SVG or an SVGGroup. 

In the DOM, you will see that some of the options translate into SVG attributes, and others to CSS.

The bounds option to the SVG sets up a the SVG coordinate system with a viewBox of [0, 0, 300, 200]. The width is set to 50%, so it will adjust to the window size.


The examples in this section are adapted from https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Basic_Shapes.


