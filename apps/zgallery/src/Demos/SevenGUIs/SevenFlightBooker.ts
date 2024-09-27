import { core, atom, Atom, em, ch } from "zaffre";
import { Button, VStack, DropDownButton, TextInput, HStack, TextBox, View } from "zaffre";
import { FlightBookerModel } from "./SevenFlightBookerModel";

const flightDirections = ["one-way flight", "return flight"];

export function SevenFlightBooker(): View {
  const model = new FlightBookerModel();

  function DateTextInput(date: Atom<Date | undefined>, disabled: Atom<boolean>): View {
    const dateString = atom(model.formatDate(date.get() || new Date()));
    dateString.addAction((val) => {
      date.set(model.parseDateString(val));
      model.booking.set("");
    });
    const valid = atom(true);
    return TextInput(dateString, {
      border: core.border.thin,
      width: em(8),
      textAlign: "center",
      disabled: disabled,
      color: atom(() => (disabled.get() ? core.color.gray : core.color.primary)),
      valid: valid,
      background: atom(() => (valid.get() ? core.color.background : core.color.pink)),
      pattern: /^\d\d\.\d\d\.\d\d\d\d$/.source,
    });
  }

  const stackOptions = {
    name: "FlightBooker",
    border: core.border.thin,
    justifyContent: "center",
    padding: core.space.s6,
    gap: core.space.s5,
    model: model,
  } as const;

  return HStack({ gap: core.space.s6 }).append(
    VStack(stackOptions).append(
      DropDownButton(model.direction, flightDirections),
      DateTextInput(model.startDate, atom(false)),
      DateTextInput(
        model.returnDate,
        atom(() => model.isOneWay())
      ),
      Button({
        label: "Book",
        action: () => model.bookFlight(),
        width: em(8),
        disabled: atom(() => !model.datesAreValid()),
        background: core.color.primaryContainer,
      })
    ),
    TextBox(model.booking, { font: core.font.body_medium, minWidth: ch(20) })
  );
}
