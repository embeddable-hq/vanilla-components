import { ColumnType } from '../enums/ColumnType';

export type ColumnConfig = {
  label: string;
  key: string;
  type: ColumnType;
  depth: number;
  children?: Column[];
};

export class Column {
  label: string;
  key: string;
  type: ColumnType;
  depth: number;
  children: Column[];

  constructor({ label, key, type, depth, children = [] }: ColumnConfig) {
    this.label = label;
    this.key = key;
    this.type = type;
    this.depth = depth;
    this.children = children;
  }

  getLeafColumns(): Column[] {
    if (!this.children.length) {
      return [this];
    }

    return this.children.reduce<Column[]>((acc, child) => {
      return [...acc, ...child.getLeafColumns()];
    }, []);
  }
}