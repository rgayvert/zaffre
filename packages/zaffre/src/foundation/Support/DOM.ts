
export const getURLOfDroppedImageFromEvent = (e: DragEvent) => {
  const html = e.dataTransfer?.getData('text/html') || "";
  const parser = new DOMParser();
  return parser.parseFromString(html, "text/html").querySelector('img')?.src;
};


export const getElementHeightWithoutPadding = (elt: HTMLElement) => {
  const style = window.getComputedStyle(elt);
  const paddingTop = parseFloat(style.paddingTop);
  const paddingBottom = parseFloat(style.paddingBottom);
  const borderTop = parseFloat(style.borderTopWidth);
  const borderBottom = parseFloat(style.borderBottomWidth);
  
  // offsetHeight includes padding and border; subtract them to get content height
  return elt.offsetHeight - paddingTop - paddingBottom - borderTop - borderBottom;
}