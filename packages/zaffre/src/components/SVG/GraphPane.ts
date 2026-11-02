import { Vertex, Edge, zset, zget, atom, Graph, VertexData2D, Point2D, znumber, zboolean, BasicAction } from ":foundation";
import { zcolor, SVG, SVGCircle, SVGLine, addClass, css_color, SVGContainerOptions } from ":core";
import { ViewList } from "../Layout";

//
// A GraphPane is an SVG component that displays a Graph that has vertices with 2D coordinates.
// Each vertex is associated with an SVGCircle, and each edge with an SVGLine. Both vertices and
// edges are in reactive arrays, so the display will update if the graph changes.
//
// To allow vertices to be dragged, just include {draggableElements: true} in the options.
//

export interface GraphPaneOptions extends SVGContainerOptions {
  space?: znumber;
  rounded?: zboolean;
  ripple?: zboolean;
  textColor?: css_color;
  vOffset?: znumber;
  vertexFillColor?: css_color;
  edgeStrokeWidth?: number;
  vertexRadius?: (v: Vertex<unknown, unknown>) => number;
  onVertexDrag?: BasicAction;
}


export const GraphPane = <V extends VertexData2D, E>(graph: Graph<V, E>, inOptions: GraphPaneOptions = {}) => {
  const options = addClass(inOptions, "GraphPane");

  const VertexCircle = (v: Vertex<V, E>) => {
    const selected = atom(false);
    return SVGCircle({
      c: v.data.location,
      r: options.vertexRadius ? options.vertexRadius(v) : 1,
      fill: options.vertexFillColor,
      transition: "cx 0.1s, cy: 0.1s",
      selected: selected,
      draggable: options.draggableElements,
      onDrag: (delta: Point2D) => zset(v.data.location, zget(v.data.location).add(delta)),
      onDragEnd: options.onVertexDrag,
    });
  };
  const EdgeLine = (e: Edge<V, E>) => {
    return SVGLine({
      pt1: atom(() => zget(e.vertex1.data.location)),
      pt2: atom(() => zget(e.vertex2.data.location)),
      stroke: zcolor.blue,
      strokeWidth: options.edgeStrokeWidth,
      transition: "x1 0.1s, y1 0.1s, x2 0.1s, x2 0.1s",
    });
  };

  return SVG(options)
    .append(
      ViewList(
        graph.edges,
        (e) => `${e.vertex1.id}-${e.vertex2.id}`,
        (e) => EdgeLine(e)
      )
    )
    .append(
      ViewList(
        graph.vertices,
        (v) => `${v.id}`,
        (v) => VertexCircle(v)
      )
    );
};
