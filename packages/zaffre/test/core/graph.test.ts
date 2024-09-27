import { expect, test, describe } from "vitest";
import { ForceDirectedGraph, Graph, Vertex, zutil } from ":foundation";

describe("graph", () => {
  const e1 = [
    [0, 1],
    [0, 2],
    [0, 5],
    [2, 1],
    [2, 4],
    [2, 3],
    [3, 5],
    [3, 4],
    [4, 6]
  ];
  /*
  const vertices = zutil.sequence(0, 7).map((i) => new Vertex(i, ""));
  const G1 = new Graph(vertices, []);
  e1.forEach(([i, j]) => G1.addEdgeWithIDs(i, j));
  G1.dump();

  const p = G1.findShortestPath(G1.vertexWithID(0)!, G1.vertexWithID(6)!);
  console.log(p);

  test("A", () => {
    expect(G1.vertices.length).toBe(7);
    expect(p.length).toBe(4);
  });

  
  //const v2 = ["Animalia", "Chordata", "Mammalia","Erinaceomorpha", "Erinaceidae", "Atelerix", "Erinaceinae", "Hemiechinus", "Mesechinus", "Paraechinus"];
  const e2: [string, string][] = [
    ["Chordata","Animalia"],
    ["Mammalia","Chordata"],
    ["Erinaceomorpha","Mammalia"],
    ["Erinaceidae","Erinaceomorpha"],
    ["Erinaceinae","Erinaceidae"],
    ["Atelerix","Erinaceinae"],
    ["Erinaceus","Erinaceinae"],
    ["Hemiechinus","Erinaceinae"],
    ["Mesechinus","Erinaceinae"],
    ["Paraechinus","Erinaceinae"],
  ];
  const G2 = new Graph(e2);
  //G2.dump();



  const p2 = G2.findShortestPath("Paraechinus", "Animalia");
  console.log(p2);

  const L1 = new ForceDirectedGraph(G1);



  test("B", () => {
    expect(L1.points.size).toBe(7);
  });

  */

});

