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
}
