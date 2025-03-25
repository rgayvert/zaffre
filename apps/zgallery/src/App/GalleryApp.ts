import { zget, App, AppContext, ZStyleSheet, zstring, AppOptions, pollAtom } from "zaffre";
import { DayJS, DomPurify, HighlightJS, MarkdownIt } from ":services";
import { Gallery } from "../Views";

//
// TODO: 
//  - add markdown style element
//

const galleryOptions: AppOptions = {
  googleFonts: ["Roboto Mono", "Sofia", "Material+Symbols+Outlined", "Material+Icons", "PT Sans Narrow"],
  codicons: true,
  errorPath: "demos/errorpage",
};

export class GalleryApp extends App {
  constructor(context = AppContext.Web) {
    super(context, galleryOptions);
    this.startWith(() => Gallery(), context);
  }

  // solitaire demo needs playing_card folder
  public resolveResource(uri: zstring): string {
    const [type, fileName] = zget(uri).split(".");
    return type === "playing_card"
      ? `${this.assetBase()}/${type}/${fileName}.png`
      : super.resolveResource(uri);
  }
  //
  // install services needed for the demos
  //   - DOMPurify for sanitization
  //   - HighlightJS for source highlighting
  //   - MarkdownIt for markdown convertion
  //
  async initialize(): Promise<void> {
    super.initialize();
    DomPurify.install();
    HighlightJS.install(this.resolveResource("url.highlight"));
    await MarkdownIt.install(this.resolveResource("url.markdownit"));    
    await DayJS.install();
    this.initializeStyles();
  }
  // add a few styles for the text demo
  initializeStyles(): void {
    ZStyleSheet.default.addRule(
      ".redacted-text>span",
      "display:inline-block;position:relative;background-color:inherit;color:transparent"
    );
    ZStyleSheet.default.addRule(
      ".redacted-text>span::before",
      "content:'';position:absolute;left:0;right:0;top:calc(50% - 5px);height:7px;background-color:gray"
    );
  }
}


