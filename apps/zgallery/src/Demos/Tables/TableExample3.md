This is another simple example that demonstrates some simple table customization.

Here we change the header background and color, and create a custom data cell view for the "On Sale" column. The CustomDataCell function handles the case of this one column, and leaves other columns to use the default cell views.

Also, note that the formatting of the Price column is handled by a NumericFormatter that uses the standard Intl API. 