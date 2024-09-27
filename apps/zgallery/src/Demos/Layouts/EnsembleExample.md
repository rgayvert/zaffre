Ensembles are the primary means of controlling which views are visible. An Ensemble contains a collection of child views, exactly one of which is visible at a given time. The children are distinguished by a string key, and created by a function which takes a string and returns a view. To be more precise, 

```js
  function Ensemble(
    currentKey: Atom<string>, 
    viewCreator: ChildCreatorFn<string>, 
    inOptions: EnsembleOptions = {}
  ): View;
```

When the currentKey changes to a value that does not correspond to an existing child, it calls the viewCreator to create the child. Each child is given the option

```js
  hidden: atom(() => child.options.id !== currentKey.get())  
```

which means that only the child whose id matches the currentKey will be visible.

The currentKey is typically controlled by another control component. Here we use a segmented button to change the key (selectedColor), and provide a viewCreator which creates a simple box. The selectedColor is given an initial value of "red", so the red child is created first; the green and blue children will not be created until the corresponding buttons are clicked.


