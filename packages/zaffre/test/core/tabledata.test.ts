import { expect, test, describe } from "vitest";
import { TableColumn } from ":foundation";

const rows = [
  ["Joe", 22, 71],
  ["Jane", 31, 65],
];
// const columns: TableColumn[] = [
//   { name: "Name", type: "string" },
//   { name: "Age", type: "number" },
//   { name: "Height", type: "number" },
// ];

// const table1 = tableData(rows, columns);

// describe("tabledata", () => {

//   test("", () => {
//     expect(table1.valueAt(0, 1)).toEqual(22);
//     table1.setValueAt(0, 1, 33);
//     expect(table1.valueAt(0, 1)).toEqual(33);
//   });
// });
