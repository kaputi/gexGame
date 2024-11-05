interface QueueNode<T> {
  data: T;
  next?: QueueNode<T>;
  prev?: QueueNode<T>;
}

export default class Queue<T> {
  public length: number;
  private head?: QueueNode<T>;
  private tail?: QueueNode<T>;

  constructor() {
    this.head = this.tail = undefined;
    this.length = 0;
  }

  add(item: T): void {
    const node = { data: item } as QueueNode<T>;
    this.length++;
    if (!this.tail) {
      this.tail = this.head = { data: item } as QueueNode<T>;
      return;
    }

    this.tail.next = node;
    this.tail = node;
  }

  remove(): T | undefined {
    if (!this.head) return undefined;

    this.length--;

    const head = this.head;
    this.head = this.head.next;

    head.next = undefined;
    if (this.length === 0) this.tail = undefined;

    return head.data;
  }

  peek(): T | undefined {
    return this.head?.data;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }
}
