import { View, core, px, VStack, Button, rect2D, loremGraph, GraphPaneOptions, GraphPane, Vertex, FDVertex } from "zaffre";
import { AnimationModel, HStack, ForceDirectedGraph, atom } from "zaffre";

export function ForceDirectedGraphExample(): View {
  const graph = loremGraph.graph(100, 50, { start: 1, end: 5 });
  const fdGraph = ForceDirectedGraph.fromGraph(graph, { iterations: 50 });
  const model = new AnimationModel({ duration: 5000 });
  model.add(fdGraph);

  const panelOptions: GraphPaneOptions = {
    bounds: rect2D(-100, -100, 200, 200),
    width: px(400),
    height: px(400),
    fill: core.color.background,
    draggableElements: true,
    edgeStrokeWidth: 1,
    vertexRadius: (v: Vertex<unknown, unknown>) => (<FDVertex>v).data.mass,
    onVertexDrag: () => model.start(),
  };

  return VStack({ gap: core.space.s5 }).append(
    GraphPane(fdGraph, panelOptions),
    HStack({ gap: core.space.s3 }).append(
      Button({
        label: atom(() => (model.isRunning ? "Stop" : "Start")),
        action: () => model.startOrStop(),
      })
    )
  );
}
