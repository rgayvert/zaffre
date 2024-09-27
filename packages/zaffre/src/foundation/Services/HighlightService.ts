
//
// HighlightService
//   - stub for source code highlighting
//   - use HighlightJS for full service
//

export type HighlightFn = (text: string) => string;

const defaultHighlightFn = (text: string): string => {
  return text;
};

export class HighlightService {
  static defaultInstance: HighlightService = new HighlightService(defaultHighlightFn);

  constructor(protected highlightFn: HighlightFn) {}

  highlight(text: string): string {
    return this.highlightFn(text);
  }
}
