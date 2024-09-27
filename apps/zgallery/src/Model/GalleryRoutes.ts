import { keyAndTitleTreeNodeFromText } from "zaffre";

const textTree = `
overview :: Overview
conventions :: Conventions
hello :: Basic Example
foundation :: Foundation
 atoms :: Atoms
 options :: Options 
 fonts :: Fonts
 colors :: Colors
  themecolors :: Theme Colors
  contrast :: Contrast
  othercolors :: Other Colors
  customcolors :: Custom Colors
  gradients :: Gradients
 transition :: Transitions
 animation :: Animation
 routing :: Routing
 placement :: Placement
components :: Components
 content :: Content
 inputs :: Inputs
 layouts :: Layouts
 text :: Text
 controls :: Controls
 lists :: Lists
 disclosure :: Disclosure
 trees :: Trees
 grids :: Grids
 floating :: Floating
 cards :: Cards
 tables :: Tables
 forms :: Forms
panels :: Panels
 tfpanel :: TF Ensemble
games :: Games
 solitaire :: Solitaire
 tictactoe :: Tic-Tac-Toe
 wordle :: Wordle
 tilepuzzle :: Tile Puzzle
 pong :: Pong
 snake :: Snake
miscellaneous :: Miscellaneous
 graphs :: Graphs
 imagefilters :: Image Filters
 regex :: RegEx
 todo :: To Do
 sevenguis :: 7 GUIs
 youtube :: YouTube
svg :: SVG
 simplesvg :: Simple Examples
 counter :: Counter
 svgmarkers :: Markers
 pendulumwaves :: Pendulum Waves`;

export const galleryTree = keyAndTitleTreeNodeFromText(textTree);

