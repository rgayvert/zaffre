import { simpleNode, treeFromSimpleNode } from "zaffre";

//
// The galleryTree is a TreeNode, defined here in declarative form.
//
const a = (key: string, title: string) => simpleNode({ key, title });

export const galleryTree = treeFromSimpleNode(
  a("gallery", "Gallery").add(
    a("overview", "Overview"),
    a("conventions", "Conventions"),
    a("hello", "Basic Example"),
    a("foundation", "Foundation").add(
      a("atoms", "Atoms"),
      a("fonts", "Fonts"),
      a("colors", "Colors").add(
        a("themecolors", "Theme Colors"),
        a("contrast", "Contrast"),
        a("othercolors", "Other Colors"),
        a("customcolors", "Custom Colors"),
        a("gradients", "Gradients")
      ),
      a("transition", "Transitions"),
      a("animation", "Animation"),
      a("placement", "Placement")
    ),
    a("components", "Components").add(
      a("cards", "Cards"),
      a("content", "Content"),
      a("controls", "Controls"),
      a("disclosure", "Disclosure"),
      a("floating", "Floating"),
      a("forms", "Forms"),
      a("grids", "Grids"),
      a("inputs", "Inputs"),
      a("layouts", "Layouts"),
      a("lists", "Lists"),
      a("menus", "Menus"),
      a("tables", "Tables"),
      a("text", "TextLabel"),
      a("trees", "Trees")
    ),
    a("games", "Games").add(
      a("solitaire", "Solitaire"),
      a("tictactoe", "Tic-Tac-Toe"),
      a("wordle", "Wordle"),
      a("tilepuzzle", "Tile Puzzle"),
      a("pong", "Pong"),
      a("snake", "Snake")
    ),
    a("miscellaneous", "Miscellaneous").add(
      a("graphs", "Graphs"),
      a("imagefilters", "Image Filters"),
      a("regex", "RegEx"),
      a("todo", "To Do"),
      a("sevenguis", "7 GUIs"),
      a("youtube", "YouTube")
    ),
    a("svg", "SVG").add(
      a("simplesvg", "Simple Examples"),
      a("counter", "Counter"),
      a("svgmarkers", "Markers"),
      a("pendulumwaves", "Pendulum Waves")
    )
  )
);
