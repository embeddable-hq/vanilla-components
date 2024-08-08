import { v4 as uuid } from 'uuid';

export class Row {
  readonly #id: string;
  #data: Record<string, any>;
  #children: Row[];
  readonly #depth: number;

  constructor(data: Record<string, any>, children: Row[] = [], depth: number = 0) {
    this.#id = uuid();
    this.#data = data;
    this.#children = children;
    this.#depth = depth;
  }

  get id(): string {
    return this.#id;
  }

  get data(): Record<string, any> {
    return this.#data;
  }

  set data(data: Record<string, any>) {
    this.#data = data;
  }

  get children(): Row[] {
    return this.#children;
  }

  set children(children: Row[]) {
    this.#children = children;
  }

  get depth(): number {
    return this.#depth;
  }

  public getLeafRows(): Row[] {
    if (!this.children.length) {
      return [this];
    }

    return this.children.reduce<Row[]>((acc, child) => {
      return [...acc, ...child.getLeafRows()];
    }, []);
  }
}