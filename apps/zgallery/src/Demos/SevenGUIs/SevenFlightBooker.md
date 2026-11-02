Task from https://eugenkiss.github.io/7guis/tasks/#flight.<br>
Challenge: Constraints.

This example requires a choice component, a pair of formatted inputs for dates, a button, and a text result. Rather than using DateInputs, we use constrained TextInputs, to match the problem specification. The default DateTimeService is used to parse and format dates as DD.MM.YYYY.

The text inputs are given a pattern to match; when the input is invalid, the background turns red. In addition, the button is enabled for a round-trip flight only when both dates are valid.