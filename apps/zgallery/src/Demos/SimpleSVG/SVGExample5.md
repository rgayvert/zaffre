Here we show how you can define and use an SVGGradient. A gradient is created with a unique id, and a sequence of SVGStops is added. Each stop has a color and an offset. Each gradient component is then added to an SVGDefs, which in turn is added to the SVG component. The gradients are then referenced in the fill options to a pair of SVGRectangles. In the second rectangle, the gradient is rotated with a gradientTransform option.

 Note that there is no need to specify ids or urls, since these are generated automatically.



