This is a demonstration of applying a set of filters to an image using a Canvas. 

The UI contains a grid of 9 labeled sliders that control the level of blur, brightness, and so on to apply to the canvas. The model converts these values into an array of FilterTokens, which is rendered into a string of the form

```js
   blur(0px) brightness(100%) contrast(100%) ...
```

which becomes the value of the reactive filter attribute on the canvas. That is, in the DOM you will see something like:

```js
element.style {
  --filter: blur(0px) brightness(100%) contrast(100%) ...
}

canvas_v_316 {
  ...
  filter: var(--filter);
  ...
}
```

The canvas is initially given a reactive image source URI ("image.flowers") from the gallery assets folder. When the canvas loads the image, this URI is resolved by the AppResources to a suitable URL (e.g., "/assets/image/wedding_flowers.jpeg"). 

A FileInput control allows the image to be changed. When a selection is made, the reactive imageFiles value is changed, and the value of the image source is set to the file selected.




