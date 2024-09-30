import { ArrayAtom, arrayAtom, atom, zutil } from "zaffre";

// Card images are from Byron Knoll, https://byronknoll.blogspot.com/2011/03/vector-playing-cards.html

enum Suit {
  clubs,
  diamonds,
  hearts,
  spades,
}
const Points = {
  stockToTalon: 0, 
  talonToFoundation: 10,
  tableauToFoundation: 10,
  talonToTableau: 5,
  tableauToTableau: 5,
  none: 0,
};

//
// A Card represents one of the cards in a standard 52-card deck. It has a suit, an index, knows the
// pile it is in, and whether it is face-up. It also works with the piles to determine where it can be moved.
//
export class Card {
  static suits = ["clubs", "diamonds", "hearts", "spades"];
  static suitColors = ["black", "red", "red", "black"];
  static names = ["ace", ...zutil.sequence(2, 9).map((i) => i.toString()), "jack", "queen", "king"];
  static cardID = 0;
  static nextID(): number {
    return this.cardID++;
  }

  suit: Suit;
  indexInSuit: number;
  name: string;
  pile?: Pile;

  faceup = atom(false, { name: `${this.toString()}-faceup` });
  imageName = atom(() => this.getImageName());
  cardID: number;

  frontImageName(): string {
    return `playing_card.${this.fullName}`;
  }
  getImageName(): string {
    return this.faceup.get() ? this.frontImageName() : "playing_card.back";
  }
  getCardID(): number {
    return Card.nextID();
  }

  constructor(public index: number) {
    this.cardID = this.getCardID();
    if (index === 0) {
      this.suit = 0;
      this.name = "blank";
      this.indexInSuit = 0;
    } else {
      this.suit = Math.floor((index - 1) / 13);
      this.indexInSuit = ((index - 1) % 13) + 1;
      this.name = Card.names[this.indexInSuit - 1];
    }
  }
  get fullName(): string {
    return `${Card.suits[this.suit]}_${this.name}`;
  }
  toString(): string {
    return this.fullName;
  }
  get color(): string {
    return Card.suitColors[this.suit];
  }
  isFaceUp(): boolean {
    return this.faceup.get();
  }
  turnFaceUp(): void {
    this.faceup.set(true);
  }
  turnFaceDown(): void {
    this.faceup.set(false);
  }
  isOnTalonPile(): boolean {
    return this.pile instanceof TalonPile;
  }
  isOnFoundationPile(): boolean {
    return this.pile instanceof FoundationPile;
  }
  isOnTableauPile(): boolean {
    return this.pile instanceof TableauPile;
  }
  isLastInPile(): boolean {
    return this === this.pile?.lastCard();
  }
  indexInPile(): number {
    return this.pile ? this.pile.cards.get().indexOf(this) : -1;
  }
  mayMoveToFoundationPile(pile: FoundationPile): boolean {
    const topCard = pile.lastCard();
    return (
      (topCard instanceof BaseCard && this.name === "ace") ||
      (topCard !== undefined && this.isLastInPile() && this.suit === topCard.suit && this.indexInSuit === topCard.indexInSuit + 1)
    );
  }
  mayMoveToTableauPile(pile: TableauPile): boolean {
    const lastCard = pile.lastCard();
    return Boolean(
      (lastCard instanceof BaseCard && this.name === "king") ||
      (lastCard && this.color !== lastCard.color && this.indexInSuit === lastCard.indexInSuit - 1)
    );
  }
  isTopOfTableauSequence(): boolean {
    const cardAbove = this.pile?.cardAtIndex(this.indexInPile() - 1);
    return this.pile instanceof TableauPile && (cardAbove === undefined || !cardAbove.faceup.get());
  }
  isBottomOfTableauSequence(): boolean {
    return this.pile?.cardAtIndex(this.indexInPile() + 1) === undefined;
  }
  willAcceptCard(dragCard: Card): boolean {
    const pile = this.pile!;
    return (
      (dragCard && dragCard !== this && pile instanceof TableauPile && this.isBottomOfTableauSequence() && dragCard.mayMoveToTableauPile(pile)) ||
      (pile instanceof FoundationPile && dragCard.mayMoveToFoundationPile(pile))
    );
  }
  willAcceptDrop(): boolean {
    return this.pile instanceof TableauPile || this.pile instanceof FoundationPile;
  }
}

//
// A BaseCard represents an empty pile, so it looks like a blank card, but has no interaction.
//
export class BaseCard extends Card {
  static baseCardID = -1;
  static nextBaseCardID(): number {
    return this.baseCardID--;
  }
  static allBaseCards: BaseCard[] = [];
  constructor() {
    super(0);
    BaseCard.allBaseCards.push(this);
  }
  getCardID(): number {
    return BaseCard.nextBaseCardID();
  }
  get fullName(): string {
    return "blank";
  }
  allowDrag(): boolean {
    return false;
  }
  turnFaceUp(): void {
    // no-up
  }
  getImageName(): string {
    return "playing_card.blank";
  }
}

//
// A Pile contains a reactive list of Cards. There are 4 concrete subclasses: StockPile, TalonPile, 
// FoundationPile, and TableauPile. Each of these has specific rules that govern the behavior.
//    
// Each pile that can have a card moved to it will implement willAcceptCard() and acceptCard(). These are used to
// determine whether a move is legal, and where to move a card in the automated case.
//
//
export abstract class Pile {
  cards: ArrayAtom<Card>; 
  baseCard = new BaseCard();

  constructor(public name: string, initialCount = 0) {
    this.cards = arrayAtom(Array<Card>(initialCount), { name: name }); 
  }
  get currentCards(): Card[] {
    return this.cards.get();
  }
  setCards(cards: Card[]): void {
    // NB: the order here is important, because the cards have derived atoms that depend on the pile,
    // and these will be triggered as soon as the pile changes
    cards.forEach((card) => (card.pile = this));
    // make sure we have a base card
    this.cards.set(cards.length > 0 && cards[0] instanceof BaseCard ? cards : [this.baseCard, ...cards]);
  }
  isEmpty(): boolean {
    return this.currentCards.length === 1;
  }
  lastCard(): Card | undefined {
    return this.currentCards.at(-1);
  }
  indexOfCard(card: Card): number {
    return this.currentCards.indexOf(card);
  }
  cardAtIndex(index: number): Card | undefined {
    return this.currentCards[index];
  }
  willAcceptCard(card: Card): boolean {
    return false;
  }
  acceptCard(card: Card): number {
    return 0;
  }
  addCard(card: Card): void {
    this.setCards([...this.currentCards, card]);
  }
  removeCard(card?: Card): void {
    card && this.setCards(this.currentCards.filter((c) => c !== card));
  }
  removeLastCard(): void {
    this.removeCard(this.lastCard());
  }
}

//
// The stock pile is a simple pile of face-down cards. When clicked, the top card gets turned face-up
// and place on the talon pile (see TalonPile.acceptCard()).
//
export class StockPile extends Pile {
  constructor() {
    super("stock", 24);
  }
}

//
// The TalonPile contains a list of face-up cards, of which only the top is visible.
//
export class TalonPile extends Pile {
  constructor() {
    super("talon");
  }
  createInitialCards(): ArrayAtom<Card> { 
    return arrayAtom([], { name: `talon` });
  }
  acceptCard(card: Card): number {
    const stockPile = card.pile;
    stockPile?.removeCard(card);
    card.faceup.set(true);
    this.addCard(card);
    return Points.stockToTalon;
  }
}

//
// There are 4 FoundationPiles, one for each suit. The cards are always face-up, and must go in ascending order.
//
export class FoundationPile extends Pile {
  constructor(public index: number) {
    super(`foundation[${index}]`);
  }
  willAcceptCard(card: Card): boolean {
    return card.mayMoveToFoundationPile(this);
  }
  acceptCard(card: Card): number {
    const fromPile = card.pile;
    if (fromPile instanceof TalonPile || fromPile instanceof TableauPile) {
      fromPile.removeLastCard();
      this.addCard(card);
      return fromPile instanceof TalonPile ? Points.talonToFoundation : Points.tableauToFoundation;
    }
    return Points.none;
  }
}

//
// There are 7 tableau piles. These vary in length during play. Only face-up cards on a tableau pile
// may be moved.
//
export class TableauPile extends Pile {
  constructor(public index: number) {
    super(`tableau[${index}]`);
  }
  willAcceptCard(card: Card): boolean {
    return card.mayMoveToTableauPile(this);
  }
  turnLastCardFaceUp(): void {
    this.currentCards.at(-1)?.turnFaceUp();
  }
  setCards(cards: Card[]): void {
    super.setCards(cards);
    this.turnLastCardFaceUp(); 
  }
  removeLastCard(): void {
    super.removeLastCard();
    this.turnLastCardFaceUp();
  }
  acceptCard(card: Card): number {
    const fromPile = card.pile;
    if (fromPile instanceof TalonPile || fromPile instanceof FoundationPile) {
      fromPile.removeLastCard();
      this.addCard(card);
      return Points.talonToTableau;
    } else if (fromPile instanceof TableauPile) {
      const index = card.indexInPile();
      const cardsToMove = fromPile.cards.get().slice(index);
      fromPile.setCards(fromPile.cards.get().slice(0, index));
      fromPile.turnLastCardFaceUp();
      this.setCards([...this.cards.get(), ...cardsToMove]);
      return Points.tableauToTableau;
    }
    return Points.none;
  }
}

