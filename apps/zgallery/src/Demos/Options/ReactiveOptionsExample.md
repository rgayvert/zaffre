In addition to literal and token values, options may have reactive values. These are typically expressed as derived atoms. For a CSS option, you will see an associated CSS property that changes as the reactive value changes. 


In this example, the opacity is specified as an atom whose value is a function of window width, which comes from a reactive value. If you resize the window, you will see the opacity of the box vary between 0 and 1. In the style for this box, you will see something like:

```css
    element.style {
      --opacity: 0.476;
    }

    box_v_316 {
      background: var(--color-primary);
      border: var(--border-thin);
      color: var(--color-primary);
      cursor: default;
      height: 10ch;
      opacity: var(--opacity);
      position: relative;
      user-select: none;
      width: 10ch;
      z-index: 0
    }
```

The value of the opacity property is a CSS variable which is set directly on the underlying element. When the component is rendered, the derived property is given an action which updates this CSS variable when its value changes.