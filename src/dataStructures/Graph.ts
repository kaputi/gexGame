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

  // djikstra(from: T, to: T): Record<string, number | T[]> | null {
  djikstra(from: T, to: T): T[] | null {
    // TODO: can be optimized by using a priority queue

    const start = this.nodes.get(from);
    const end = this.nodes.get(to);

    if (!start || !end) return null;

    const visited = new Set<GraphNode<T>>();
    visited.add(start);

    const toVisit: GraphNode<T>[] = [];

    const distances = new Map<GraphNode<T>, number>();
    distances.set(start, 0);

    const previous = new Map<GraphNode<T>, GraphNode<T>>();

    let current = start;

    while (true) {
      const dist = distances.get(current)!;

      const adjacent = current.adjacent;

      for (const [node, weight] of adjacent) {
        if (!visited.has(node)) toVisit.push(node);

        const adjDist = dist + weight;

        if (previous.has(node)) {
          const prevDist = distances.get(node);
          if (prevDist && adjDist < prevDist) {
            distances.set(node, adjDist);
            previous.set(node, current);
          }
        } else {
          previous.set(node, current);
          distances.set(node, adjDist);
        }
      }

      visited.add(current);

      if (toVisit.length === 0) break;

      current = toVisit.shift()!;
    }

    const path: T[] = [];
    current = end;
    while (current !== start) {
      path.push(current.data);
      current = previous.get(current)!;
    }
    path.push(start.data);
    path.reverse();

    // const totalDistance = distances.get(end)!;
    // return { path, distance: totalDistance };

    return path;
  }
}
