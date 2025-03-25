import { addDocumentBodyScript, addDocumentHeaderLink, atom, inDarkMode, resolveURI } from "zaffre";
import { MarkdownService, MarkdownFn, HighlightService } from "zaffre";

export interface MarkdownItOptions {
  pluginInNames?: string[];
  highlighter?: HighlightService;
}

// TODO: support plugins

export class MarkdownIt extends MarkdownService {

  public static async install(url: string, inOptions: MarkdownItOptions = {}): Promise<void> {
    await addDocumentBodyScript(url, true);
    const styles = atom(() => inDarkMode() ? resolveURI("url.github-markdown-dark") : resolveURI("url.github-markdown-light"));
    addDocumentHeaderLink(styles);

    const { default: markdownItConstructor } = await import("markdown-it");
    const options = {
      html: true,
      linkify: true,
      typographer: true,    };
    const markdownIt = new markdownItConstructor(options);

    this.render = (s: string): string => markdownIt.render(s);
    MarkdownService.defaultInstance = new MarkdownIt();
  }
  private static render: MarkdownFn;

  constructor(protected options: MarkdownItOptions = {}) {
    super(MarkdownIt.render);
  }
}
