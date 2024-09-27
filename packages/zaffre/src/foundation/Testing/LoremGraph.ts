import { zutil } from "../Util";
import { Edge, Graph, Vertex } from "../Graph";
import { Interval } from "../Geometry";

//
// loremGraph - create a randomized basic graph with (close to) the requested 
// number of vertices and edges
//
//

export const loremGraph = {

  graph: (
    nvertices: number,
    nedges: number,
    vertexWeights?: Interval,
    edgeWeights?: Interval
  ): Graph<unknown, unknown> => {
    const vertices = zutil
      .sequence(0, nvertices)
      .map((i) => new Vertex(i, vertexWeights ? { weight: zutil.random(vertexWeights.start, vertexWeights.end) } : {}));
    const graph = new Graph(vertices);
    while (graph.edges.length < nedges) {
      const pair = zutil.randomSubset(vertices, 2);
      if (!graph.edgeWithVertices(pair[0], pair[1])) {
        graph.addEdge(new Edge(pair[0], pair[1]));
      }
    }
    // add an edge for each solo vertex
    graph.vertices.forEach((v) => {
      if (v.adjacentVertices.size === 0) {
        const w = zutil.randomElementMatching(graph.vertices, (w) => w !== v);
        w && graph.addEdge(new Edge(v, w));
      }
    });
    return graph;
  },
  weightedVertexGraph: (nvertices: number, nedges: number, vertexWeights: Interval): Graph<unknown, unknown> => {
    return loremGraph.graph(nvertices, nedges, vertexWeights);
  },
};
