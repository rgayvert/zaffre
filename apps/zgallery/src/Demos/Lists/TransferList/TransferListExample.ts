import { TransferList } from "zaffre";
import { ExampleTransferModel } from "./TransferListExample.model";

export const TransferListExample = () => {

  const model = new ExampleTransferModel();

  return TransferList(model.transferModel);
}
