import { zget, App, AppContext, ZStyleSheet, zstring, AppOptions, resolveURI, ResourceMap, zutil } from "zaffre";
import { DayJS, DomPurify, HighlightJS, MarkdownIt } from ":services";
import { Gallery } from "../Views";
import { zaffreDefaults, galleryDefaults } from ":resources";

//
// TODO:
//  - add markdown style element
//

const galleryOptions: AppOptions = {
  //googleFonts: ["Roboto:wght@400;500;600&display=swap", "Sofia", "Material+Symbols+Outlined", "Material+Icons", "PT Sans Narrow"],
  googleFonts: [
    "Inter:wght@100;200;300;400;500;600;700&display=swap",
    "Sofia",
    "Material+Symbols+Outlined",
    "Material+Icons",
    "PT Sans Narrow",
  ],
  codicons: true,
  errorPath: "demos/errorpage",
  useBasicRouter: true,
  routeToInitialPath: true,
};

export class GalleryApp extends App {
  constructor(context = AppContext.Web) {
    super(context, galleryOptions);

    //setInitialRoutePath();
    console.log(zutil.maskEmail("court@zaffre.io"));

    this.startWith(() => Gallery(), context);
  }

  createResourceMap(): ResourceMap {
    const map = super.createResourceMap();
    const pat = /playing_card.(.*)/;
    map.addPattern(pat, (match) => `${this.resourceURL()}/playing_card/${match}.png`);
    return map;
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
    HighlightJS.install(resolveURI("url.highlight"));
    await MarkdownIt.install(resolveURI("url.markdownit"));
    await DayJS.install();
    this.initializeStyles();
    this.installComponentDefaults(zaffreDefaults);
    this.installComponentDefaults(galleryDefaults);
  }
  // add a few styles for the text demo
  initializeStyles(): void {
    ZStyleSheet.default.addRule(
      ".redacted-text>span",
      "display:inline-block;position:relative;background-color:inherit;color:transparent",
    );
    ZStyleSheet.default.addRule(
      ".redacted-text>span::before",
      "content:'';position:absolute;left:0;right:0;top:calc(50% - 5px);height:7px;background-color:gray",
    );
  }
}
