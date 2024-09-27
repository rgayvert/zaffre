Adding SVG
  
SVG components may be constructed and added to HTML components. Zaffre treats HTML and SVG components are near equals. The syntax and use of reactive values is very similar. The main difference is that an SVG container (\<svg\>) may only contain SVG views.

Notes:
  - Here we have an SVG added to a VStack.
  - The SVG contains an SVGCircle and SVGText.
  - The SVG components can have reactive attributes. In this example, the circle radius and text font size vary with the length of the reactive input.