import { Atom, atom, counterAtom, fetchTextAtom, indexedArrayAtom, setAtom, resolveURI, zlog, zutil } from "zaffre";

// 2of12 word list is from Alan Beale, http://wordlist.aspell.net/12dicts/

type Guess = Atom<string>[];

export class WordleModel {
  static validLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  allWords: string[] = [];
  wordsByLength = new Map<number, string[]>();

  wordLength = 5;
  numberOfGuesses = 6;
  guesses = Array<Guess>(this.numberOfGuesses);
  matchedRow = counterAtom(-1);
  currentRow = counterAtom(0);
  currentIndex = 0;
  wordToMatch = "";
  keysSeenInCorrectSpot = setAtom<string>(); 
  keysSeenInWrongSpot = setAtom<string>();
  unusedLetters = setAtom<string>();
  status = atom("Enter guess #1");
  gameInProgress = atom(false, { name: "gameInProgress" });
  newGameButtonLabel = atom("Loading...");
  loadAtom = fetchTextAtom(resolveURI("wordle/2of12inf.txt"), { action: () => this.load() });
  toastItems = indexedArrayAtom<string>([], { maxLength: 1 });
  
  constructor() {
    for (let row = 0; row < this.numberOfGuesses; row++) {
      this.guesses[row] = zutil.sequence(0, this.wordLength).map((col) => atom(""));
    }
  }
  wordOnRow(row: number): string {
    return row < this.numberOfGuesses ? this.guesses[row].map((guess) => guess.get()).join("") : "";
  }
  currentWord(): string {
    return this.wordOnRow(this.currentRow.get());
  }
  validInput(key: string): boolean {
    return WordleModel.validLetters.includes(key) || key === "ENTER" || key === "DELETE" || key === "BACKSPACE";
  }
  keyClicked(key: string): void {
    key = key.toUpperCase();
    if (!this.validInput(key)) {
      return;
    }
    const currentWord = this.currentWord();
    if (key === "DELETE" || key === "BACKSPACE") {
      if (currentWord.length > 0) {
        this.currentIndex--;
        this.guessAtIndex(this.currentIndex).set("");
      }
    } else if (key === "ENTER" && currentWord.length === this.wordLength) {
      this.currentWordIsKnown() && this.submitWord(currentWord);
    } else if (key === "ENTER") {
      zlog.info("Too short");
    } else if (currentWord.length < this.wordLength) {
      this.guessAtIndex(this.currentIndex).set(key);
      this.currentIndex++;
    }
  }
  acceptWord(word: string): void {
    [...word].forEach((ch, index) => {
      if (ch === this.wordToMatch[index]) {
        this.keysSeenInCorrectSpot.add(ch);
      } else if (this.wordToMatch.includes(ch)) {
        this.keysSeenInWrongSpot.add(ch);
      } else {
        this.unusedLetters.add(ch);
      }
    });
    this.status.set(`Enter guess #${this.currentRow.get() + 2}`);
  }
  currentWordIsKnown(): boolean {
    const wordList = this.wordsByLength.get(this.wordLength)!;
    return wordList && wordList.includes(this.currentWord().toLowerCase());
  }
  submitWord(word: string): void {
    this.acceptWord(word);
    this.currentRow.increment();
    this.matchedRow.increment();
    if (word === this.wordToMatch) {
      this.toastItems.addValue("You Won! 🏆");
      this.gameInProgress.set(false);
    } else if (this.currentRow.get() === this.numberOfGuesses) {
      if (word !== this.wordToMatch) {
        this.toastItems.addValue(`The word was ${this.wordToMatch}.`);
        this.gameInProgress.set(false);
      }
    }
  }
  guessAtIndex(index: number): Atom<string> {
    const [row, col] = this.indexToRowCol(index);
    return this.guesses[row][col];
  }
  indexToRowCol(index: number): [number, number] {
    const row = Math.floor(index / this.wordLength);
    return [row, index - row * this.wordLength];
  }
  pickWordToMatch(): void {
    const wordList = this.wordsByLength.get(this.wordLength)!;
    this.wordToMatch = wordList[zutil.randomInt(0, wordList.length - 1)].toUpperCase();
    this.gameInProgress.set(true);
    zlog.info("word to match: " + this.wordToMatch);
  }
  newGame(): void {
    this.guesses.forEach((row) => row.forEach((guess) => guess.set("")));
    this.matchedRow.set(-1);
    this.currentRow.set(0);
    this.currentIndex = 0;
    this.keysSeenInCorrectSpot.clear(); 
    this.keysSeenInWrongSpot.clear(); 
    this.unusedLetters.clear(); 
    this.pickWordToMatch();
    this.toastItems.addValue("Guess the word");
  }

  load(): void {
    this.allWords = this.loadAtom.get().split(/\r\n?|\n/).filter((w) => !w.endsWith("%"));
    zlog.info(`Loaded ${this.allWords.length} words`);
    this.newGameButtonLabel.set("New Game");
    this.allWords.forEach((word) => {
      let list = this.wordsByLength.get(word.length);
      if (!list) {
        list = [];
        this.wordsByLength.set(word.length, list);
      }
      list.push(word);
    });
    this.pickWordToMatch();
  }
}
