import { Graph, GraphNode } from '../src/dataStructures/Graph';

const graph1 = new Graph<string>();

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
letters.forEach((letter) => {
  graph1.addNode(letter);
});

graph1.addEdge('A', 'F', 2);
graph1.addEdge('A', 'C', 3);

graph1.addEdge('B', 'D', 1);
graph1.addEdge('B', 'E', 2);
graph1.addEdge('B', 'F', 6);
graph1.addEdge('B', 'G', 2);

graph1.addEdge('C', 'A', 3);
graph1.addEdge('C', 'D', 4);
graph1.addEdge('C', 'E', 1);
graph1.addEdge('C', 'F', 2);

graph1.addEdge('D', 'B', 1);
graph1.addEdge('D', 'C', 4);

graph1.addEdge('E', 'B', 2);
graph1.addEdge('E', 'C', 1);
graph1.addEdge('E', 'F', 3);

graph1.addEdge('F', 'A', 2);
graph1.addEdge('F', 'B', 6);
graph1.addEdge('F', 'C', 2);
graph1.addEdge('F', 'E', 3);

graph1.addEdge('G', 'B', 2);
graph1.addEdge('G', 'F', 5);

test('graph -> djikstra', () => {
  const { nodes, distance } = graph1.djikstra('A', 'B')!;

  expect(nodes).toEqual(['A', 'C', 'E', 'B']);
  expect(distance).toEqual(6);
});

test('graph -> A*', () => {
  function heuristic<T>(node: GraphNode<T>): number {
    if (node.data === 'A') return 0;
    else return 0;
    // const h: Record<string, number> = {
    //   A: 5,
    //   B: 4,
    //   C: 3,
    //   D: 2,
    //   E: 1,
    //   F: 1,
    //   G: 0,
    // };
  }

  const { nodes, distance } = graph1.aStar('A', 'B', heuristic)!;

  expect(nodes).toEqual(['A', 'C', 'E', 'B']);
  expect(distance).toEqual(6);
});

test('graph -> BFS', () => {
  const { nodes, distance } = graph1.breadthFirstSearch('A', 'B')!;

  expect(nodes).toEqual(['A', 'F', 'B']);
  expect(distance).toEqual(2);
});
