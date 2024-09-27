A Graph<V, E> is a generic object containing a set of vertices and a set of edges, where an edge is related to exactly two vertices. A vertex may have related data V, and an edge related data E.

If the data associated with each vertex contains an zpoint2D (i.e., it extends VertexData2D), we can display the graph using a GraphPane. And if the location is reactive, we can drag each vertex.

In this example we create a graph with 4 vertices and 4 edges. Each vertex is given a reactive location. The GraphPane is an SVG container. We give it bounds which will include the vertex locations, and a width of 50% so that is scales with the window size.