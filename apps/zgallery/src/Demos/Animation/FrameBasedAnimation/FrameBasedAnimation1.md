Frame-based Animation
  
A frame-based animation consists of a animation model containing animation items along with an Animator that controls when the animation runs. Each item in the model has reactive values for location and velocity, and is associated with a component in the view. In this example, the item have fixed velicities, so they move in a straight line.

When the Animator runs, it calls requestAnimationFrame() repeatedly and gives each animation item a chance to update its position. Be default, a SimpleAnimationItem will update its location by adding its velocity vector in each step. Subclasses of SimpleAnimationItem can modify this by implementing the step() method.