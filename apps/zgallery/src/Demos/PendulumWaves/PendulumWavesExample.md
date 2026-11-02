This is a demonstration of how you can create an interesting animation using SVG. The rules for the pendulum display are simple, but yield a surprisingly complex result. It seems to show varying sinusoidal paths horizontally, but that turns out to be a consequence of the timing of the movement of the balls, which are individually moving only vertically. If you focus on a single ball, you will notice that it moves up and down at varying speeds, and changes brightness with its vertical displacement.

With the given configuration,
  - the SVG viewBox is 750x300
  - there are 75 Balls distributed evenly
  - each Ball has a corresponding SVGCircle with a location and filter defined by the Ball
  - the model is an AnimationModel, which means that it has a reactive boolean value called 'running'
  - a Ball is an AnimationItem, so its step() method will be called periodically while the animation is running
  - the step() method increments a counter atom
  - the y value of each ball is updated on each step, based on the ball index and count value

This example was adapted from https://codepen.io/manifestinteractive/pen/azdGyv.

