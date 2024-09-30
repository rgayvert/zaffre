import { zpoint2D } from "../Geometry";

//
// A Graph is a generic object containing a set of vertices and a set of edges,
// where an edge is related to exactly two vertices. A vertex may have related data V,
// and an edge related data E.
//
// 

export class Vertex<V, E> {
  adjacentVertices: Set<Vertex<V, E>> = new Set();
  constructor(public id: number, public data: V) {}
  toString(): string {
    return `<${this.id}>`;
  }
  addEdge(edge: Edge<V, E>): void {
    this.adjacentVertices.add(edge.vertex1 === this ? edge.vertex2 : edge.vertex1);
  }
  removeEdge(edge: Edge<V, E>): void {
    this.adjacentVertices.delete(edge.vertex1 === this ? edge.vertex2 : edge.vertex1);
  }
}

function vertexPairsAreEqual(pair1: [number, number], pair2: [number, number]): boolean {
  return (pair1[0] === pair2[0] && pair1[1] === pair2[1]) || (pair1[0] === pair2[1] && pair1[1] === pair2[0]);
}
export class Edge<V, E> {

  constructor(public vertex1: Vertex<V, E>, public vertex2: Vertex<V, E>, public data?: E) {
    vertex1.addEdge(this);
    vertex2.addEdge(this);
  }
  containsVertex(vertex: Vertex<V, E>): boolean {
    return vertex === this.vertex1 || vertex === this.vertex2;
  }
  containsVertices(vertex1: Vertex<V, E>, vertex2: Vertex<V, E>): boolean {
    return vertexPairsAreEqual([this.vertex1.id, this.vertex2.id], [vertex1.id, vertex2.id]);
  }
  toString(): string {
    return `[${this.vertex1.id} -> ${this.vertex2.id}]`;
  }
}


export class Graph<V, E> {

  constructor(public vertices: Vertex<V, E>[], public edges: Edge<V, E>[] = [], public isDirected = false) {
  }
  vertexWithID(id: number): Vertex<V, E> | undefined {
    return this.vertices.find((v) => v.id === id);
  }
  addVertex(vertex: Vertex<V, E>): void {
    this.vertices.push(vertex);
  }
  addEdge(edge: Edge<V, E>): void {
    this.edges.push(edge);
    edge.vertex1.addEdge(edge);
    edge.vertex2.addEdge(edge);
  }
  addEdgeWithIDs(id1: number, id2: number, data?: E): void {
    this.addEdgeWithVertices(this.vertexWithID(id1), this.vertexWithID(id2));
  }
  addEdgeWithVertices(vertex1?: Vertex<V, E>, vertex2?: Vertex<V, E>, data?: E): void {
    vertex1 && vertex2 && this.addEdge(new Edge(vertex1, vertex2, data));
  }
  edgeWithVertices(vertex1: Vertex<V, E>, vertex2: Vertex<V, E>): Edge<V, E> | undefined {
    return this.edges.find((edge) => edge.containsVertex(vertex1) && edge.containsVertex(vertex2));
  }

  // breadth-first search
  findShortestPath(startVertex: Vertex<V, E>, destVertex: Vertex<V, E>): number[] {
    const queue = [];
    const visited = new Set<Vertex<V, E>>;
    const edgeTo = new Map<Vertex<V, E>, Vertex<V, E>>();
    const distTo = new Map<Vertex<V, E>, number>();
    distTo.set(startVertex, 0);
    queue.push(startVertex);
    while(queue.length > 0) {
      const v = queue.shift()!;
      [...v.adjacentVertices].forEach((w) => {
        if (!visited.has(w)) {
          queue.push(w);
          visited.add(w);
          if (!edgeTo.has(w)) {
            edgeTo.set(w, v);
          }
          if (!distTo.has(w)) {
            distTo.set(w, (distTo.get(v)! + 1));
          }
        }
      });
    }
    if (!edgeTo.has(destVertex)) {
      return [];
    } else {
      // backtrack
      const path = [destVertex];
      let v = edgeTo.get(destVertex)!;
      path.push(v);
      while(v !== startVertex) {
        v = edgeTo.get(v)!;
        path.push(v);
      }
      return path.reverse().map((v) => v.id);
    }
  }
}

// A plain graph does not necessarily have any particular layout. If we require each
// vertex to have a location, we can make a sensible display of the graph.

export interface VertexData2D {
  location: zpoint2D;
}
