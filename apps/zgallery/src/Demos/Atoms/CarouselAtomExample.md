Another common pattern is a carousel list, modeled by a carousel atom. This is similar to a counter atom, but steps through a generic list of values rather than a sequence of numbers, using next() and previous(). It can be configured to be bounded or circular (the default).


Notes:
  - CarouselAtom is a generic atom which takes an array (literal or reactive) of any type.
  - See the [Carousel](/demos/layouts/carousel/demo) demo for an example with images. 