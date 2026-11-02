import { simpleTableModel, NumericFormatter, TableModel, stringColumn, size2D, TableColumnBuilderList } from "zaffre";
import { numberColumn, booleanColumn, imageColumn, resolveURI } from "zaffre";

export interface Fruit {
  type: string;
  quantity: number;
  price: number;
  onSale: boolean;
  uri: string;
}

export class ExampleTableModel3 {
  rows: Fruit[] = [
    { type: "Apples", quantity: 200, price: 2.39, onSale: true, uri: "image.apple" },
    { type: "Bananas", quantity: 15, price: 0.69, onSale: false, uri: "image.bananas" },
    { type: "Oranges", quantity: 13, price: 1.35, onSale: true, uri: "image.orange" },
    { type: "Durian", quantity: 1, price: 12.35, onSale: false, uri: "image.durian" },
  ];
  dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  columns: TableColumnBuilderList<Fruit> = [
    stringColumn<Fruit>("Fruit", (r) => r.type),
    numberColumn<Fruit>("Qty", (r) => r.quantity).alignment("center"),
    numberColumn<Fruit>("Price", (r) => r.price)
      .formatter(NumericFormatter({ intl: this.dollars }))
      .alignment("center"),
    booleanColumn<Fruit>("On Sale", (r) => r.onSale).alignment("center"),
    imageColumn<Fruit>("Fruit", (r) => r.uri).size(size2D(80, 80)),
  ];

  tableModel3: TableModel<Fruit>;

  constructor() {
    this.tableModel3 = simpleTableModel(this.rows, this.columns);
  }
}
