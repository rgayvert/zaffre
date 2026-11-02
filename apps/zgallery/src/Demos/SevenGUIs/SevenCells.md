Task from https://eugenkiss.github.io/7guis/tasks/#cells<br>
Challenges: change propagation, widget customization, implementing a more authentic/involved GUI application.

The notion of widget customization here is dubious; in this example, the task is to take a table-like widget and customize it to become a spreadsheet widget. It should be possible, but in general this is a bad idea. A spreadsheet component should be based on abstractions that make sense for a spreadsheet, not for a table. 

So we give this a try. The model contains a SimpleTableModel with string cells, with columns labeled A to F, and start with some initial values that include some numbers and some formulas. Only a few basic operations are supported (+, -, *, =). 

What we leverage here is the column formatter, which is hijacked to evaluate the contents of a cell and remap anything that looks like a formula (i.e., starts with '='). If it is, we use a regex to parse the expression and do some basic math.

So this works, but it's very unsatisfying.

