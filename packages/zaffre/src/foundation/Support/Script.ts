import { ContentSecurity } from "./ContentSecurity";

//
// Dynamically add a script to the document body. To ensure that the script content is
// available we wrap this in a Promise, so the client call this with await.
// 

export function addDocumentBodyScript(url: string, defer = false): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    if (ContentSecurity.nonce) {
      script.setAttribute("nonce", ContentSecurity.nonce);
    }
    script.setAttribute("src", ContentSecurity.qualifyURL(url));
    if (defer) {
      script.setAttribute("defer", "true");
    }
    script.addEventListener("load", resolve);
    script.addEventListener("error", reject);
    document.body.appendChild(script);
  });
}
