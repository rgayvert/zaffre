import { HighlightJS } from "./HighlightJS/HighlightJS";
import { MarkdownIt } from "./MarkdownIt/MarkdownIt";

export function highlightSourceText(source: string): string {
  return `<pre>${HighlightJS.defaultInstance.highlight(source)}</pre>`;
}

export function convertMarkdown(text: string): string {
  const markdownIt = MarkdownIt.defaultInstance;
  return markdownIt.renderMD(text);
}
