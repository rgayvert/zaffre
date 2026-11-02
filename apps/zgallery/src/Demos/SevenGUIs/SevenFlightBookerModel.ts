import { atom, Atom, BasicDateParser, DateTimeFormatter, simpleMenuItemList } from "zaffre";

const flightDirections = ["one-way flight", "return flight"] as const;
type FlightDirection = typeof flightDirections[number];

export class FlightBookerModel {
  booking = atom("");
  selectedDirection = atom<FlightDirection | null>("one-way flight");
  directionList = simpleMenuItemList([...flightDirections], this.selectedDirection);
  startDate: Atom<Date | null> = atom(new Date());
  returnDate: Atom<Date | null> = atom(new Date());

  isOneWay(): boolean {
    return this.selectedDirection.get() === "one-way flight";
  }
  parseDateString(s: string): Date | null {
    return BasicDateParser("DD.MM.YYYY")(s);
  }
  formatDate(date: Date): string {
    return DateTimeFormatter("DD.MM.YYYY", "utc")(date);
  }
  bookFlight(): void {
    const startDate = this.startDate.get();
    const returnDate = this.returnDate.get();
    const line1 = startDate && this.formatDate(startDate);
    const line2 = returnDate && this.formatDate(returnDate);
    this.booking.set(this.isOneWay() ? `Leaving: ${line1}` : `Leaving: ${line1}<br>Returning: ${line2}`);
  }
  datesAreValid(): boolean {
    const startDate = this.startDate.get();
    const returnDate = this.returnDate.get();    
    return Boolean(this.isOneWay() ? startDate : startDate && returnDate && startDate < returnDate);
  }
}
