import { SharedModel, vector2D, namedAtom } from "zaffre";

export class PythagorusModel extends SharedModel {
  a = namedAtom("a", 3);
  b = namedAtom("b", 4);
  c = namedAtom("c", 5); 
 
  constructor(worker?: Worker) {
    super(worker);
    this.setAtoms([this.a, this.b, this.c]);
    if (!this.worker) {
      this.a.addAction(() => this.calculateC());
      this.b.addAction(() => this.calculateC());
    }
  }
  calculateC(): void {
    this.log("calculateC");
    this.c.set(vector2D(this.a.get(), this.b.get()).magnitude());
  }
}
let model: PythagorusModel;
self.onmessage = async (e: MessageEvent<any>): Promise<void> => {
  if (Object.keys(e.data).includes("zaffre_msg_type")) {
    model ??= new PythagorusModel();
    model.update(e.data.changes);
  }

};
