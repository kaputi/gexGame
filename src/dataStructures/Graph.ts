import { PriorityQueue } from './PriorityQueue';

export class GraphNode<T> {
  private _adjacent = new Map<GraphNode<T>, number>();

  constructor(public data: T) {}

  get adjacent() {
    return this._adjacent;
  }

  addAdjacent(node: GraphNode<T>, weight = 1): void {
    this._adjacent.set(node, weight);
    if (!node._adjacent.has(this)) {
      node.addAdjacent(this, weight);
    }
  }

  removeAdjacent(node: GraphNode<T>): void {
    this._adjacent.delete(node);
    node._adjacent.delete(this);
  }

  isConnected(node: GraphNode<T>): boolean {
    return this._adjacent.has(node);
  }
}

export interface GraphPath<T> {
  nodes: T[];
  distance: number;
}

export class Graph<T> {
  nodes = new Map<T, GraphNode<T>>();

  addNode(data: T): GraphNode<T> {
    let node = this.nodes.get(data);
    if (node) return node;

    node = new GraphNode(data);
    this.nodes.set(data, node);

    return node;
  }

  removeNode(data: T): GraphNode<T> | null {
    const nodeToRemove = this.nodes.get(data);
    if (!nodeToRemove) return null;

    this.nodes.forEach((node) => {
      node.removeAdjacent(nodeToRemove);
    });

    this.nodes.delete(data);

    return nodeToRemove;
  }

  addEdge(from: T, to: T, weight = 1): void {
    const fromNode = this.addNode(from);
    const toNode = this.addNode(to);

    fromNode.addAdjacent(toNode, weight);
  }

  removeEdge(from: T, to: T): void {
    const fromNode = this.nodes.get(from);
    const toNode = this.nodes.get(to);

    if (fromNode && toNode) {
      fromNode.removeAdjacent(toNode);
    }
  }

  djikstra(from: T, to: T): GraphPath<T> | null {
    const start = this.nodes.get(from);
    const end = this.nodes.get(to);

    if (!start || !end) return null;

    const distances = new Map<GraphNode<T>, number>();
    const previous = new Map<GraphNode<T>, GraphNode<T>>();
    const visited = new Set<GraphNode<T>>();

    const priorityQueue = new PriorityQueue<GraphNode<T>>();
    distances.set(start, 0);
    priorityQueue.enqueue(start, 0);

    while (!priorityQueue.isEmpty()) {
      const current = priorityQueue.dequeue()!;
      visited.add(current);

      if (current === end) break;

      for (const [neighbor, weight] of current.adjacent) {
        if (visited.has(neighbor)) continue;

        const newDist = distances.get(current)! + weight;
        if (newDist < (distances.get(neighbor) || Infinity)) {
          distances.set(neighbor, newDist);
          previous.set(neighbor, current);
          priorityQueue.enqueue(neighbor, newDist);
        }
      }
    }

    if (!previous.has(end)) return null;

    const path: T[] = [];
    let step = end;
    while (step !== start) {
      path.push(step.data);
      step = previous.get(step)!;
    }
    path.push(start.data);
    path.reverse();

    return { nodes: path, distance: distances.get(end)! };
  }

  aStar(from: T, to: T, heuristic: (node: GraphNode<T>) => number = () => 1): GraphPath<T> | null {
    const start = this.nodes.get(from);
    const end = this.nodes.get(to);

    if (!start || !end) return null;

    // set of discoverd nodes that may need to be (re-)expanded
    // initialy only the start node is known
    // this is usually implemented as a min-heap or priority queue rather than a hash-set
    // TODO: use min-heap
    const openSet = new Set<GraphNode<T>>([start]);

    // for node n, cameFrom[n] is the node immediately preceding it on the
    // cheapest path from start to n currently known
    const cameFrom = new Map<GraphNode<T>, GraphNode<T>>();

    // for node n, gScore[n] ist he current cost of getting from the start node to n
    const gScore = new Map<GraphNode<T>, number>();
    gScore.set(start, 0);

    // for node n, fScore[n] := gScoren[n] + h(n).
    // fScore[n] represents our current best guess as to ho cheap a path could be
    // from start to finish if it goes through n
    const fScore = new Map<GraphNode<T>, number>();
    fScore.set(start, heuristic(start));

    while (openSet.size > 0) {
      // current = the node in openSet having the lowest fScore[] value
      const current = Array.from(openSet).reduce((a, b) =>
        fScore.get(a)! < fScore.get(b)! ? a : b
      );

      if (current === end) {
        // reconstruct path
        const path: T[] = [current.data];
        const distance = gScore.get(current)!;

        let prev = cameFrom.get(current);
        while (prev) {
          path.unshift(prev.data);
          prev = cameFrom.get(prev);
          if (prev === start) {
            path.unshift(start.data);
            break;
          }
        }

        return { nodes: path, distance };
      }

      openSet.delete(current);

      for (const [neighbor, neighborWeight] of current.adjacent) {
        // d(current, neighbor) is the weight of the edge from current to neighbor
        // tentative_gScore is the cost of the path from start to the neighbor through current
        const tentativeGScore = gScore.get(current)! + neighborWeight;

        const gScoreNeighbor = gScore.get(neighbor) || Infinity;
        if (tentativeGScore < gScoreNeighbor) {
          // this path to neighbor is better than any previous one. Record it!
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentativeGScore);
          fScore.set(neighbor, gScore.get(neighbor)! + heuristic(neighbor));
          openSet.add(neighbor);
        }
      }
    }

    return null;
  }

  bfs(from: T, to: T): GraphPath<T> | null {
    const start = this.nodes.get(from);
    const end = this.nodes.get(to);

    if (!start || !end) return null;

    const visited = new Set<GraphNode<T>>();
    const queue: GraphNode<T>[] = [];
    const previous = new Map<GraphNode<T>, GraphNode<T>>();

    queue.push(start);
    visited.add(start);

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current === end) break;

      for (const [neighbor] of current.adjacent) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          previous.set(neighbor, current);
          queue.push(neighbor);
        }
      }
    }

    if (!previous.has(end)) return null;

    const path: T[] = [];
    let step = end;
    while (step !== start) {
      path.push(step.data);
      step = previous.get(step)!;
    }
    path.push(start.data);
    path.reverse();

    return { nodes: path, distance: path.length - 1 };
  }
}
