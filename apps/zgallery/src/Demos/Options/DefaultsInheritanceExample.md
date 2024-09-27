In the process of composing a component, default values are merged at each step. For example, a VStack is just a Stack with additional options, a Stack is just a Box, and so on:

      VStack -> Stack -> Box -> HTML

That is, a VStack is just an HTML component (a DIV), with a merged set of options that yield a particular behavior. This merging provides a type of inheritance of options.


In this example, when two boxes are placed inside a third box (FoxOnFoxInBox), the inner boxes are arranged vertically because the default display is block. A Stack is a box with some additional defaults:

```js
defineComponentDefaults<StackOptions>("Stack", "Box", {
  display: "flex",
  flexWrap: "nowrap",
  alignItems: "center",
  justifyContent: "center",
});
```

The default direction for a flexbox is row, so when a Stack is used, the boxes will be arranged horizontally. In addition, we can add a gap for some space. Finally, a VStack changes the default for the flex direction to make it vertical:

```js
defineComponentDefaults<StackOptions>("VStack", "Stack", {
  flexDirection: "column",
});
```