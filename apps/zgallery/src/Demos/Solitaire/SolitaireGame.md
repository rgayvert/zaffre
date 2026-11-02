This is an implementation of standard (Klondike) Solitaire. There are 7 tableau piles, 4 foundation piles (1 for each suit), a stock pile, and a talon pile. The goal is to move all of the cards onto the foundation piles, built from Ace up to King.

You can move cards by dragging them, but the fastest method is to click on a card and let the destination be determined automatically, or to hit the space bar to turn over the next card on the talon pile.

The main component (SolitaireGame.ts) just contains a header with the score and time, along with a grid that contains all of the piles. The grid (SolitaireGrid.ts) has 2 rows and 7 columns (with one empty space), for a total of 14 piles. Each pile is a ZStack containing a ViewList of PlayingCard components, and is associated with a Pile in the model. A PlayingCard is just an ImageBox that supports both clicking and dragging, and is associated with a Card in the model. 

The most interesting part about a PlayingCard is its mounted effect. When the associated Card is moved from one pile to another, it is unmounted (but retained) from the first pile, and added to the second pile. The effect

```js
    mounted: transitions.slideFromPreviousLocation("in")
```

is how all of the animation is performed, including dealing and autoplay. This effect says that the position of the view will be animated from its previous position (the first pile) to the new position when it is mounted on the second pile. 

If there are no face-down cards and the talon pile is empty, the game has been won, so it will automatically play the remaining cards. 



Note: the code for this game has been factored out into a separate package in order to use it in both the gallery and a separate application.