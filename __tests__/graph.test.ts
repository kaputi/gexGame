import { Graph } from '../src/dataStructures/Graph';

test('graph', () => {
  const graph = new Graph<string>();

  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  letters.forEach((letter) => {
    graph.addNode(letter);
  });

  graph.addEdge('A', 'F', 2);
  graph.addEdge('A', 'C', 3);

  graph.addEdge('B', 'D', 1);
  graph.addEdge('B', 'E', 2);
  graph.addEdge('B', 'F', 6);
  graph.addEdge('B', 'G', 2);

  graph.addEdge('C', 'A', 3);
  graph.addEdge('C', 'D', 4);
  graph.addEdge('C', 'E', 1);
  graph.addEdge('C', 'F', 2);

  graph.addEdge('D', 'B', 1);
  graph.addEdge('D', 'C', 4);

  graph.addEdge('E', 'B', 2);
  graph.addEdge('E', 'C', 1);
  graph.addEdge('E', 'F', 3);

  graph.addEdge('F', 'A', 2);
  graph.addEdge('F', 'B', 6);
  graph.addEdge('F', 'C', 2);
  graph.addEdge('F', 'E', 3);

  graph.addEdge('G', 'B', 2);
  graph.addEdge('G', 'F', 5);

  const result = graph.djikstra('A', 'B');

  expect(result).toEqual({ path: ['A', 'C', 'E', 'B'], distance: 6 });
});
