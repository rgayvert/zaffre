Most HTML components are implemented as DIV elements with varying styles. If you examine this sample in a web debugger, you will see something like this:

```html
    <div zname="HStack_305" class="h-stack_v_305" mutation-observed="">
      <div zname="TextLabel_306" class="text-label_v_306">Hello, World</div>
      <div zname="TextLabel_307" class="text-label_v_307">Hello, World</div>
    </div>
```

Components are customized by specifying options. The base ViewOptions interface contains around 50 possible keys; HTMLOptions adds about 30 more, and CSSAttributeOptions an extra 100 or so. Each component has a base options class, so in practice only a handful of options are typically needed when creating a component. Note that options are **always** optional; any value is always needed for a component should be passed as a required argument. See the [CounterDemo](<<LINK_PREFIX>>/demos/counter) for a concrete example of defining and using options.


If you examine the styles in either the DOM inspector or a web debugger, you will see that the first text label has a style that looks something like:

```css
    text-label_v_306 {
      background: var(--color-inherit);
      color: var(--color-surface-contrast);
      cursor: default;
      font: var(--font-body-medium);
      outline: var(--border-none);
      position: relative;
      user-select: none;
      white-space: nowrap;
      z-index: 0
    }
``` 

Since no options were specified for the first text label, this represents the options in the base options class for a TextLabel. A base options class for a reusable component should be defined along with its implementation. For a TextLabel, the base options happen to be:

```js
  defineBaseOptions<TextLabelOptions>("TextLabel", "Box", {
    font: core.font.body_medium,
    color: core.color.surface.contrast,
    selectionColor: core.color.secondaryContainer,
    background: core.color.inherit,
    outline: core.border.none,
    userSelect: "none",
    whiteSpace: "nowrap",
  });
```

Note that some of the values for the first text label are not from the TextLabel base options, but instead from the base options for Box, which are inherited.


The style for the second text label looks like this:

```css
    text-label_v_307 {
      background: var(--color-primaryContainer);
      border: var(--border-thin);
      color: var(--color-red);
      cursor: default;
      font: var(--font-headline-small);
      outline: var(--border-none);
      padding: var(--space-s2);
      position: relative;
      user-select: none;
      white-space: nowrap;
      z-index: 0
    }
```

The second text label specifies border, font, color, padding, and background. Of these, only padding was not included in the base options. Hence, the only additional key in the second style is for padding, and the values for the other keys have been replaced by the ones in the specified options.


Also, note that the tokens (e.g., core.color.red) have been converted into CSS variables. The actual values for these are determined by the current theme.


