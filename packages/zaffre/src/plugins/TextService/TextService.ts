import { HighlightJS } from "../HighlightJS";
import { MarkdownIt } from "../MarkdownIt";

export const highlightSourceText = (source: string) => {
  return `<pre>${HighlightJS.defaultInstance.highlight(source)}</pre>`;
}

export const convertMarkdown = (text: string) => {
  const markdownIt = MarkdownIt.defaultInstance;
  return markdownIt.renderMD(text);
}
