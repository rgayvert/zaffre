import { atom, Atom, BasicDateParser, DateTimeFormatter } from "zaffre";

type FlightDirection = "one-way flight" | "return flight";

export class FlightBookerModel {
  booking = atom("");
  direction: Atom<FlightDirection> = atom("one-way flight", { action: () => this.booking.set("") });
  startDate: Atom<Date | undefined> = atom(new Date());
  returnDate: Atom<Date | undefined> = atom(new Date());

  isOneWay(): boolean {
    return this.direction.get() === "one-way flight";
  }
  parseDateString(s: string): Date | undefined {
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
