
//
// MarkdownService
//   - stub for markdown conversion
//   - use markdown-it for full service
//

export type MarkdownFn = (text: string) => string;

const defaultMarkdownFn = (text: string): string => {
  return text;
};

export class MarkdownService {
  static defaultInstance: MarkdownService = new MarkdownService(defaultMarkdownFn);

  constructor(protected markdownFn: MarkdownFn) {}

  renderMD(text: string): string {
    return this.markdownFn(text);
  }
}
