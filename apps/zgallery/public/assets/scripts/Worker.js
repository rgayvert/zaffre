import { atom } from "./packages/zaffre/src/core/Foundation";
self.onmessage = async (e) => {
    console.log("worker got message", e.data);
    const xx = new W();
    setTimeout(() => postMessage("Hello from worker: val = " + xx.val.get()), 1000);
};
class W {
    val = atom(42);
}
//# sourceMappingURL=Worker.js.map