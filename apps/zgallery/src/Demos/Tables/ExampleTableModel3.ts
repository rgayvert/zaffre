import { booleanColumn, numericColumn, simpleTableModel, stringColumn, TableColumnList } from "zaffre";
import { NumericFormatter, TableColumns, TableModel } from "zaffre";

export interface Fruit {
  type: string;
  quantity: number;
  price: number;
  onSale: boolean;
}

export class ExampleTableModel3 {
  rows: Fruit[] = [
    { type: "Apples", quantity: 200, price: 2.39, onSale: true },
    { type: "Bananas", quantity: 15, price: 0.69, onSale: false },
    { type: "Oranges", quantity: 13, price: 1.35, onSale: true },
    { type: "Durian", quantity: 1, price: 12.35, onSale: false },
  ];
  dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  columns = [
    stringColumn({ title: "Fruit", value: (r) => r.type, alignment: "left" }),
    numericColumn({ title: "Qty", value: (r) => r.quantity }),
    numericColumn({ title: "Price", value: (r) => r.price, formatter: NumericFormatter({ intl: this.dollars }) }),
    booleanColumn({ title: "On Sale", value: (r) => r.onSale }),
  ] as TableColumnList<Fruit>;

  tableModel3: TableModel<Fruit>;

  constructor() {
    this.tableModel3 = simpleTableModel(this.rows, this.columns);
  }
}
