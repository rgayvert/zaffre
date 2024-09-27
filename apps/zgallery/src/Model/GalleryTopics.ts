import { ImportAtom, Loading, View, ViewCreator, ch, importAtom } from "zaffre";
import { Markdown } from "../Demos/Common";

export const galleryTopics = new Map([
  ["animation", importAtom(async () => import(":demos/Animation/AnimationDemo"))],
  ["atoms", importAtom(async () => import(":demos/Atoms/AtomDemo"))],
  ["cards", importAtom(async () => import(":demos/Cards/CardDemo"))],
  ["content", importAtom(async () => import(":demos/Content/ContentDemo"))],
  ["contrast", importAtom(async () => import(":demos/Colors/ContrastingColorsDemo"))],
  ["controls", importAtom(async () => import(":demos/Controls/ControlsDemo"))],
  ["counter", importAtom(async () => import(":demos/Counter/CounterDemo"))],
  ["customcolors", importAtom(async () => import(":demos/Colors/CustomColorsDemo"))],
  ["disclosure", importAtom(async () => import(":demos/Disclosure/DisclosureDemo"))],
  ["floating", importAtom(async () => import(":demos/Floating/FloatingDemo"))],
  ["fonts", importAtom(async () => import(":demos/Fonts/FontDemo"))],
  ["forms", importAtom(async () => import(":demos/Forms/FormsDemo"))],
  ["gradients", importAtom(async () => import(":demos/Colors/GradientDemo"))],
  ["graphs", importAtom(async () => import(":demos/Graphs/GraphDemo"))],
  ["grids", importAtom(async () => import(":demos/Grid/GridDemo"))],
  ["hello", importAtom(async () => import(":demos/HelloWorld/HelloWorld"))],
  ["imagefilters", importAtom(async () => import(":demos/ImageFilters/ImageFiltersDemo"))],
  ["inputs", importAtom(async () => import(":demos/Inputs/InputsDemo"))],
  ["layouts", importAtom(async () => import(":demos/Layouts/LayoutsDemo"))],
  ["lists", importAtom(async () => import(":demos/Lists/ListsDemo"))],
  ["options", importAtom(async () => import(":demos/Options/OptionsDemo"))],  
  ["othercolors", importAtom(async () => import(":demos/Colors/OtherColorsDemo"))],
  ["pendulumwaves", importAtom(async () => import(":demos/PendulumWaves/PendulumWavesDemo"))],
  ["placement", importAtom(async () => import(":demos/Placement/PlacementDemo"))],
  ["pong", importAtom(async () => import(":demos/Pong/PongDemo"))],
  ["regex", importAtom(async () => import(":demos/RegEx/RegExDemo"))],
  ["routing", importAtom(async () => import(":demos/Routing/RoutingDemo"))],
  ["sevenguis", importAtom(async () => import(":demos/SevenGUIs/SevenGUIsDemo"))],
  ["simplesvg", importAtom(async () => import(":demos/SimpleSVG/SVGExamplesDemo"))],
  ["snake", importAtom(async () => import(":demos/Snake/SnakeDemo"))],
  ["solitaire", importAtom(async () => import(":demos/Solitaire/SolitaireDemo"))],
  ["svgmarkers", importAtom(async () => import(":demos/SVGMarkers/SVGMarkerDemo"))],
  ["themecolors", importAtom(async () => import(":demos/Colors/ThemeColorsDemo"))],
  ["tables", importAtom(async () => import(":demos/Tables/TableDemo"))],
  ["text", importAtom(async () => import(":demos/Text/TextDemo"))],
  ["tfpanel", importAtom(async () => import(":demos/Panels/TableFormEnsembleDemo"))],
  ["tictactoe", importAtom(async () => import(":demos/TicTacToe/TicTacToeDemo"))],
  ["tilepuzzle", importAtom(async () => import(":demos/TilePuzzle/TilePuzzle"))],
  ["todo", importAtom(async () => import(":demos/ToDo/ToDoDemo"))],
  ["trees", importAtom(async () => import(":demos/Trees/TreesDemo"))],
  ["transition", importAtom(async () => import(":demos/Transition/TransitionDemo"))],
  ["wordle", importAtom(async () => import(":demos/Wordle/WordleDemo"))],
  //["workers", importAtom(async () => import(":demos/Workers/WorkerDemo"))],
  ["youtube", importAtom(async () => import(":demos/YouTube/YouTubeDemo"))],
]);

export function DemoTopicComponent(topic: ImportAtom<ViewCreator>): View {
  const viewCreator: ViewCreator = () => Loading(topic);
  return viewCreator();
}

interface GalleryInfo {
  key: string;
  viewCreator: ViewCreator;
}

export const infoPages: GalleryInfo[] = [
  {
    key: "overview",
    viewCreator: () => Markdown({ uri: "/source/Demos/Overview.md", maxWidth: ch(100) }),
  },
  {
    key: "conventions",
    viewCreator: () => Markdown({ uri: "/source/Demos/Conventions.md", maxWidth: ch(100) }),
  },
  {
    key: "errorpage",
    viewCreator: () => Markdown({ uri: "url.error-page" }),
  },
];
