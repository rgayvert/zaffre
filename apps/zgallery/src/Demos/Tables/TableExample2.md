Here we have a more realistic example of a table. A TableModel consists of a list of records of a specific type, along with a list of columns. A column contains a title, a value function, and a formatter; it provides the content for each cell in a column of the table.

In this example we have a simple record with four fields: name, age, city, and state. Three rows are defined, and 3 columns. Note that the the Location column concatenates the city and state fields, and the Age column rounds the value of the age field. A column may also have a custom sort function; in this case, we just use the default string comparison.

