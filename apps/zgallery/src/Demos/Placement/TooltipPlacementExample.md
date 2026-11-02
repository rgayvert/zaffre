
Zaffre provides a placement mechanism which allows you to place a box relative to a *reference view*. If not specified, the reference view is the parent of the box. The idea is to identify one point on each box, and position the box so that the two points coincide. An offset from this point can also be specified. For convenience, the most commonly used points are identified as
*cardinal* points. These are denoted by combinations of (xstart, xcenter, xend) and (ystart, ycenter, and yend). For example if you wanted to position a box such that its upper left was at the lower right of its parent, you would use xstart-ystart for the box and xend-yend for the reference. An offset from the point can also be specified.
  
Placement is particularly useful for floating views. In this example, we show how the choice of placement affects the position of a tooltip.

