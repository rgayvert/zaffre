import {atom, Atom, em, ch, zcolor, zborder, zfont, zspace } from "zaffre";
import { Button, VStack, DropDownButton, TextInput, HStack, TextBox } from "zaffre";
import { FlightBookerModel } from "./SevenFlightBookerModel";


export const SevenFlightBooker = () => {
  const model = new FlightBookerModel();

  const DateTextInput = (date: Atom<Date | null>, disabled: Atom<boolean>) => {
    const dateString = atom(model.formatDate(date.get() || new Date()));
    dateString.addAction((val) => {
      date.set(model.parseDateString(val));
      model.booking.set("");
    });
    const valid = atom(true);
    return TextInput(dateString, {
      border: zborder.thin,
      width: em(8),
      textAlign: "center",
      disabled: disabled,
      color: () => (disabled.get() ? zcolor.gray : zcolor.primary),
      valid: valid,
      background: () => valid.get() ? zcolor.background : zcolor.pink,
      pattern: /^\d\d\.\d\d\.\d\d\d\d$/.source,
    });
  }

  const stackOptions = {
    name: "FlightBooker",
    border: zborder.thin,
    justifyContent: "center",
    padding: zspace.s6,
    gap: zspace.s5,
    model: model,
  } as const;

  return HStack({ gap: zspace.s6 }).append(
    VStack(stackOptions).append(
      DropDownButton(model.directionList),
      DateTextInput(model.startDate, atom(false)),
      DateTextInput(
        model.returnDate,
        atom(() => model.isOneWay())
      ),
      Button({
        label: "Book",
        action: () => model.bookFlight(),
        width: em(8),
        disabled: () => !model.datesAreValid(),
        background: zcolor.primaryContainer,
      })
    ),
    TextBox(model.booking, { font: zfont.body_medium, minWidth: ch(20) })
  );
}
