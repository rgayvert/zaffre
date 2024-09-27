This is an implementation of TicTacToe using a combination of SVG and HTML components. The main component (TicTacToe.ts) contains a straightforward layout of a pair of labels, a grid of SVGTextLabels, and a history list. The content and attributes of these components is determined by the state of the model.

The model (TicTacToeModel.ts) maintains the value and state of each box, along with a list of all moves. It also contains the logic for the game; that is, whose turn it is, and whether there is a winner.

When an entry in the history list is clicked, the game will be reset to the state it was in at that point in the game. To accomplish this, all the model has to do is truncate the moveList (goToMove()), which will trigger an action that calls moveListChanged(), which in turn recalculates the value of each box. When these values change in the model, the UI will update automatically to reflect the new state.
