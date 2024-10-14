import { zget, zboolean, znumber, atom, Graph, VertexData2D } from ":foundation";
import { Vertex, Edge, rect2D, zset, BasicAction } from ":foundation";
import { css_color, View, SVG, SVGContainerOptions, SVGCircle, SVGLine, BV, restoreOptions } from ":core";
import { core, defineComponentBundle, mergeComponentOptions } from ":core";
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
defineComponentBundle<GraphPaneOptions>("GraphPane", "SVG", {
  bounds: rect2D(0, 0, 100, 100),
  textColor: core.color.primary,
  userSelect: "none",
  fill: core.color.background,
  vertexFillColor: core.color.blue,
  edgeStrokeWidth: 0.5,
});

export function GraphPane<V extends VertexData2D, E>(graph: Graph<V, E>, inOptions: BV<GraphPaneOptions> = {}): View {
  const options = mergeComponentOptions("GraphPane", inOptions);

  function VertexCircle(v: Vertex<V, E>): View {
    const selected = atom(false);
    return SVGCircle({
      c: v.data.location,
      r: options.vertexRadius ? options.vertexRadius(v) : 1,
      fill: options.vertexFillColor,
      transition: "cx 0.1s, cy: 0.1s",
      selected: selected,
      draggable: options.draggableElements,
      onDrag: (delta) => zset(v.data.location, zget(v.data.location).add(delta)),
      onDragEnd: options.onVertexDrag,
    });
  }
  function EdgeLine(e: Edge<V, E>): View {
    return SVGLine({
      pt1: atom(() => zget(e.vertex1.data.location)),
      pt2: atom(() => zget(e.vertex2.data.location)),
      stroke: core.color.blue,
      strokeWidth: options.edgeStrokeWidth,
      transition: "x1 0.1s, y1 0.1s, x2 0.1s, x2 0.1s",
    });
  }

  return restoreOptions(
    SVG(options)
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
      )
  );
}
