There are several different ways to add animation to a component. The first two examples here use AnimationSpecs, which translate directly into CSS animation attributes. You can also use effect-based animations and frame-based animations.
  
Notes:

- The box is given an animation spec that is defined using key frames.
- The reactive value *model.running* controls when the animation runs.
- The switch controls the model.running value.
- An intersection action is added to turn off the animation when the view becomes invisible.
