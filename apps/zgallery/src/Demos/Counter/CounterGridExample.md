This is an illustration of how to create a reusable component that uses SVG. At the top level, we have a 2x2 grid to which is appended 4 Counters, each of which has different options. Note that Count() requires a key argument, but the options are all optional. The first counter is not given any options, so it will take on all of the default values.

A Counter is defined as an SVG that contains 3 SVGTextLabels that display a numeric value, a plus sign and a minus sign.  These are laid out inside an SVG with a viewBox of size 100x120. The options for a Counter are defined like this:

```js
export interface CounterOptions extends SVGContainerOptions {
  rounded?: zboolean;
  min?: number;
  max?: number;
  initialValue?: number;
}
```

Since CounterOptions extends SVGContainerOptions, which extends SVGViewOptions, and so on, there are about 200 options that could be specified. Fortunately, only a few are needed in this case. And in most cases, the defaults (which are cascaded) provide reasonable behavior.
The defaults for Counter are given as: 

```js
defineComponentDefaults<CounterOptions>("Counter", "", {
  rounded: true,
  min: 0,
  max: 99,
  initialValue: 0,
  bounds: Rct2D(0, 0, 100, 120),
  width: pct(100),
});
```

Note that bounds and width are inherited options. 

In the Counter() function, the first thing you do is adjust the options passed in:

```js
  const options = mergeComponentDefaults("Counter", inOptions);
```

The value of options will be a copy of inOptions, with the default values applied where the corresponding keys were not present.

The Counter() function contains only a declaration of the UI layout, along with options for each component. The logic required for the counters is contained in the CounterModel. The model maintains reactive values for the value and whether it can be incremented/decremented (based on max/min options). The value is tied to a key in LocalData, so it will be remembered on subsequent reloads.

Notes: 
  - the presence of the events options in the plus/minus items leads to these items having interactive state, so they are given hover/press/clicked effects, along with a disable effect when one of the boundaries is reached.
