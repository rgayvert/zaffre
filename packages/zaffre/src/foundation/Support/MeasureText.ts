let canvas: HTMLCanvasElement;

//
// CSS-font 
//   font: [font-style] [font-variant] [font-weight] [font-size] / [line-height] [font-family];   
// Examples:
//   12px sans-serif;
//   italic small-caps bold 24px/1.5 "Helvetica Neue", sans-serif;
//
export const getTextWidth = (text: string, font: string) => {
  if (!canvas) {
    canvas = document.createElement("canvas");
  }
  const context = canvas.getContext("2d");
  if (context) {
    context.font = font; // e.g., "bold 14px Arial"
    const metrics = context.measureText(text);
    return metrics.width;
  } else {
    return 0;
  }
};

// Usage
// const width = getTextWidth("Hello World", "bold 16px Arial");
// console.log("textWidth="+width); // Returns width in pixels
