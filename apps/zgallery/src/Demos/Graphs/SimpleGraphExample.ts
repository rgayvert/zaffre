import { Graph, GraphPane, pct, Vertex, zutil, atom,rect2D, point2D, zborder } from "zaffre";

//
// Simple example of a 2D Graph. The data associated with each vertex includes a location, so
// we can display this graph easily using a GraphPane, which creates SVG points and lines for
// the vertices and edges. And since the locations area reactive, we can drag each vertex.
//

export const SimpleGraphExample = () => {
  const points = [
    [10, 10],
    [40, 10],
    [40, 30],
    [70, 30],
  ];
  const edgePairs = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
  ];
  const vertices = zutil.sequence(0, 4).map((i) => {
    const data = { location: atom(point2D(points[i][0], points[i][1])) };
    return new Vertex(i, data);
  });
  const graph = new Graph(vertices);
  edgePairs.forEach(([id1, id2]) => graph.addEdgeWithIDs(id1, id2));

  return GraphPane(graph, {
    bounds: rect2D(0, 0, 100, 40),
    border: zborder.thin,
    draggableElements: true,
    width: pct(50),
  });
}
