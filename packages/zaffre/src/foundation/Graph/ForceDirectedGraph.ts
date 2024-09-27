import { zutil } from "../Util";
import { Point2D, point2D, Vector2D, Sz2D, vector2D, Size2D } from "../Geometry";
import { Atom, atom } from "../Atom";
import { Edge, Graph, Vertex } from "./Graph";

//
// A ForceDirectedGraph is a graph where the data contains a 2D location, force, and mass.
// Initially, the locations will be random. The idea is to reposition the vertices using a 
// combination of:
//   - gravity to pull the vertices toward the center,
//   - repulsion between each pair of vertices, and
//   - spring attraction between the vertices on each edge.
//
// Typically, after several hundred iterations, the vertices will be positioned reasonably
// well with little overlap of edges.

// Adapted from https://editor.p5js.org/JeromePaddick/sketches/bjA_UOPip

export interface FDPointForce {
  location: Atom<Point2D>;
  force: Vector2D;
  mass: number;
}
export type FDVertex = Vertex<FDPointForce, unknown>;
export type FDEdge = Edge<FDPointForce, unknown>;

interface ForceDirectedGraphOptions {
  size?: Size2D;
  gravity?: number;
  repulsion?: number;
  springSize?: number;
  stepSize?: number;
  iterations?: number;
}
const defaultForceDirectedGraphOptions: ForceDirectedGraphOptions = {
  size: Sz2D(200, 200),
  gravity: 1,
  repulsion: 100,
  springSize: 0.5,
  stepSize: 0.01,
  iterations: 300,
};
export class ForceDirectedGraph extends Graph<FDPointForce, unknown> {
  static fromGraph(graph: Graph<unknown, unknown>, options: ForceDirectedGraphOptions): ForceDirectedGraph {
    const sz = options.size || Sz2D(200, 200);
    const vertices = graph.vertices.map(
      (v) => new Vertex(v.id, { location: this.randomPoint(sz), force: vector2D(0, 0), mass: this.randomMass() })
    );
    const edges = graph.edges.map(
      (e) => new Edge(vertices.find((v) => v.id === e.vertex1.id)!, vertices.find((v) => v.id === e.vertex2.id)!)
    );
    return new ForceDirectedGraph(vertices, edges, options);
  }
  static randomPoint(sz: Size2D): Atom<Point2D> {
    return atom(point2D(zutil.randomInt(-0.45 * sz.x, 0.45 * sz.x), zutil.randomInt(-0.45 * sz.y, 0.45 * sz.y)));
  }
  static randomMass(): number {
    return zutil.random(2, 3);
  }

  config: ForceDirectedGraphOptions;
  iterationCount = 0;

  constructor(vertices: FDVertex[], edges: FDEdge[], options: ForceDirectedGraphOptions = {}) {
    super(vertices, edges);
    this.config = Object.assign({ ...defaultForceDirectedGraphOptions }, options);
  }
  applyForces(v: FDVertex, w: FDVertex): void {
    const delta = w.data.location.get().subtract(v.data.location.get());
    const repulseForce = <Vector2D>delta.scalarMultiply(this.config.repulsion! / delta.magnitudeSquared());
    v.data.force = <Vector2D>v.data.force.subtract(repulseForce);
    w.data.force = <Vector2D>w.data.force.add(repulseForce);

    if (v.adjacentVertices.has(w)) {
      const springForce = <Vector2D>delta.scalarMultiply(0.1);
      v.data.force = <Vector2D>v.data.force.add(springForce);
      w.data.force = <Vector2D>w.data.force.subtract(springForce);
    }
  }
  step(_msec: number): void {
    zutil.repeatForMillis(16, () => this.iterateOnce());
    this.iterationCount++;
  }
  iterateOnce(): void {
    const vertices = this.vertices;
    // each vertex has a gravity force to pull it to the center
    vertices.forEach((v) => (v.data.force = <Vector2D>v.data.location.get().scalarMultiply(-this.config.gravity!)));
    // add repulsive and attractive forces
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        this.applyForces(vertices[i], vertices[j]);
      }
    }
    // adjust the positions
    vertices.forEach((v) => {
      v.data.location.set(v.data.location.get().add(v.data.force.scalarMultiply(0.2 * v.data.mass)));
    });
  }
}
