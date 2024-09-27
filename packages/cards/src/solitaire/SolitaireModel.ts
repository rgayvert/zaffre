import { LocalData, atom, timerAtom, zget, incrementAtom, zutil } from "zaffre";
import { BaseCard, Card, FoundationPile, Pile, StockPile, TableauPile, TalonPile } from "./CardsAndPiles";

//
// SolitaireModel deals the cards into piles, keeps track of the score, and handles most of the logic
// involved when cards are clicked.
//

export class SolitaireModel {
  data = LocalData.instance;

  newGame(): void {
    this.deal();
    this.score.set(0);
    this.elapsedTime.stop();
  }

  deck = zutil.sequence(1, 52).map((index) => new Card(index));
  score = atom(0);
  elapsedTime = timerAtom((msec) => `Time: ${zutil.formatSeconds(msec / 1000)}`, 1000);
  scoreString = atom(() => `Score: ${this.score.get()}`);
  highScore = this.data.addAtom("solitaireHighScore", 0);
  highScoreString = atom(() => `High Score: ${this.highScore.get()}`);
  lowTime = this.data.addAtom("solitaireLowTime", 0);
  lowTimeString = atom(() => `Best Time: ${zutil.formatSeconds(this.lowTime.get())}`);

  addToScore(amount: number): void {
    incrementAtom(this.score, amount);
    if (this.score.get() > this.highScore.get()) {
      this.highScore.set(this.score.get());
    }
  }
  stopClock(): void {
    this.elapsedTime.stop();
    const seconds = Math.floor(this.elapsedTime.elapsedMilliseconds() / 1000);
    const lowest = this.lowTime.get();
    if (lowest === 0 || seconds < lowest) {
      this.lowTime.set(seconds);
    }
  }

  stockPile = new StockPile();
  talonPile = new TalonPile();
  foundationPiles = zutil.sequence(0, 4).map((i) => new FoundationPile(i));
  tableauPiles = zutil.sequence(0, 7).map((i) => new TableauPile(i));

  gameIsWon(): boolean {
    return !this.deck.find((c) => !c.isFaceUp()) && this.talonPile.isEmpty();
  }

  deal(): void {
    this.deck.forEach((card) => card.turnFaceDown());
    zutil.shuffle(this.deck);
    this.stockPile.setCards(this.deck.slice(0, 24));
    this.talonPile.setCards([]);
    for (let i = 0; i < 4; i++) {
      this.foundationPiles[i].setCards([]);
    }
    for (let i = 0; i < 7; i++) {
      this.tableauPiles[i].setCards([]);
    }

    let start = 24;
    for (let i = 0; i < 7; i++) {
      this.tableauPiles[i].setCards(this.deck.slice(start, start + i + 1));
      start += i + 1;
    }
  }
  findDestinationPileForCard(card: Card): Pile | undefined {
    const fromPile = card.pile;
    if (fromPile instanceof StockPile) {
      return this.talonPile;
    } else if (card.faceup.get()) {
      if (card.name === "ace") {
        return this.foundationPiles.find((p) => p.willAcceptCard(card));
      } else if (card.name === "2") {
        return (
          this.foundationPiles.find((p) => p.willAcceptCard(card)) ||
          this.tableauPiles.find((p) => p.willAcceptCard(card))
        );
      } else if (fromPile instanceof TalonPile) {
        return (
          this.tableauPiles.find((p) => p.willAcceptCard(card)) ||
          this.foundationPiles.find((p) => p.willAcceptCard(card))
        );
      } else if (fromPile instanceof TableauPile) {
        return (
          this.foundationPiles.find((p) => p.willAcceptCard(card)) ||
          this.tableauPiles.find((p) => p.willAcceptCard(card))
        );
      } else if (fromPile instanceof FoundationPile) {
        return this.tableauPiles.find((p) => p.willAcceptCard(card));
      }
    }
    return undefined;
  }
  turnTopStockCard(): void {
    this.startTimerIfNotRunning();
    const stockCards = this.stockPile.cards.get();
    if (stockCards.length > 1) {
      const card = stockCards[stockCards.length - 1];
      this.talonPile.acceptCard(card);
    } else {
      this.flipTalonPile();
    }
  }
  flipTalonPile(): void {
    const cards = zget(this.talonPile.cards).slice(1).reverse();
    cards.forEach((card) => card.turnFaceDown());
    this.stockPile.setCards(cards);
    this.talonPile.setCards([]);
  }
  cardMayBeMoved(card: Card): boolean {
    const mayMoveToFoundation = Boolean(this.foundationPiles.find((p) => p.willAcceptCard(card)));
    const mayMoveToTableau = Boolean(this.tableauPiles.find((p) => p.willAcceptCard(card)));
    return (
      card.faceup &&
      ((card instanceof BaseCard && card.pile === this.stockPile) ||
        card.pile === this.stockPile ||
        mayMoveToFoundation ||
        mayMoveToTableau)
    );
  }
  startTimerIfNotRunning(): void {
    if (!this.elapsedTime.isRunning()) {
      this.elapsedTime.start();
    }
  }
  cardClicked(card: Card): void {
    if (this.gameIsWon()) {
      // ignore click while running autoplay
      return;
    }
    this.startTimerIfNotRunning();
    if (card instanceof BaseCard && card.pile === this.stockPile) {
      this.flipTalonPile();
    } else {
      const toPile = this.findDestinationPileForCard(card);
      if (toPile) {
        this.addToScore(toPile.acceptCard(card));
        if (this.stockPile.isEmpty() && this.talonPile.isEmpty() && !this.deck.find((c) => !c.isFaceUp())) {
          this.autoPlay();
        }
      }
    }
    if (this.gameIsWon()) {
      this.stopClock();
    }
  }
  autoPlay(): void {
    const [card, pile] = this.findMovableCard();
    if (card) {
      this.addToScore(pile.acceptCard(card));
      setTimeout(() => {
        this.autoPlay();
      }, 100);
    }
  }
  findMovableCard(): [Card, Pile] | [undefined, undefined] {
    for (const p of this.tableauPiles) {
      const card = p.lastCard();
      if (card) {
        const pile = this.foundationPiles.find((p) => p.willAcceptCard(card));
        if (pile) {
          return [card, pile];
        }
      }
    }
    return [undefined, undefined];
  }
}
