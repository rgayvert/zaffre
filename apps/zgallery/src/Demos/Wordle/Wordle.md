Wordle is a popular word game where you try to guess a random word. In this implementation, all of the words are 5-letters English words, and you have 6 tries. After a guess, each letter in your guess is given a green, orange, or gray color. Green means the letter is in the correct position, orange means the letter appears in the word but not in the right place, and gray means the letter does not appear in the word. If 5 letters are entered that do not make a word, the letters are shown in red. Also, the keyboard keys change color to show you which keys have been tried.

The main Wordle component (Wordle.ts) contains a (mostly) standard Qwerty keyboard along with a grid of 6 rows by 5 columns to hold your guesses. There is also a button to start a new game and a ToastStack to show a few messages. 

The basic keyboard (Keyboard.ts) is a VStack of HStacks of buttons. The action option will fire when any key button is pressed. WordleKeyboard is a keyboard with colors that come from the state of the WordleModel, and an action which notifies the model of a keypress.

The guesses list (WordleGuesses.ts) is a VStack of HStacks of letter boxes, each of which gets its color from the model.

The model (WordleModel.ts) contains all of the logic for the game. It loads the list of ~81k words and selects a random word. As keys are entered, lists of which letters are correct, in the wrong place, and unused are maintained in reactive arrays, so as the state of the model changes, the keys in the UI are updated to display the model state.


The list of word used here was taken from the 12dicts collection at http://wordlist.aspell.net/12dicts.