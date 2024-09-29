import { HighlightService, HighlightFn, addDocumentHeaderLink } from "zaffre";

export class HighlightJS extends HighlightService {

  public static async install(url: string): Promise<void> {
    addDocumentHeaderLink(url);

    // customized highlighter generated from https://highlightjs.org/

    const { default: hljs } = await import("./highlightjs/highlight.js");
    this.highlightFn = (s: string): string => hljs.highlightAuto(s).value;

    HighlightService.defaultInstance = new HighlightJS();
  }
  private static highlightFn: HighlightFn;

  constructor() {
    super(HighlightJS.highlightFn);
  }
}
