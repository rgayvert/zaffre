//
// downloadText - call this from a button action to download a chunk of text.
// This should bring up a standard file dialog and allow the user to choose a destination.
//

export function downloadText(text: string, fileName: string): void {
  var element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
  element.setAttribute("download", fileName);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const blobURL = URL.createObjectURL(blob);
  var element = document.createElement("a");
  element.href = blobURL;
  element.setAttribute("download", fileName);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  window.URL.revokeObjectURL(blobURL);
}
