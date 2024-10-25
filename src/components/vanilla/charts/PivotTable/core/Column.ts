import { NativeDataType } from '@embeddable.com/core';
import { ColumnType } from '../enums/ColumnType';

export type ColumnConfig = {
  label: string;
  key: string;
  type: ColumnType;
  dataType?: NativeDataType;
  depth: number;
  parent?: Column | null;
  children?: Column[];
  group?: Column[];
};

/**
 * Class that represents a single column of the table and can have nested children columns
 * @class
 */
export class Column {
  /**
   * Column label that will be displayed in the table
   * @type {string}
   * @required
   */
  label: string;

  /**
   * Column key that serves as an accessor for the value and should be unique among all columns
   * @type {string}
   * @required
   */
  key: string;

  /**
   * Column type
   * @type {ColumnType}
   * @required
   */
  type: ColumnType;

  /**
   * Column data type that will be used for formatting of the value
   * @type {NativeDataType | null}
   * @required
   */
  dataType: NativeDataType | null;

  /**
   * Column depth in the column hierarchy
   * @type {number}
   * @optional
   */
  depth: number;

  /**
   * Column children that are nested under this column
   * @type {Column[]}
   * @optional
   */
  children: Column[] | null;

  /**
   * Reference to parent column that this column is nested under
   * @type {Column}
   * @optional
   */
  parent: Column | null;

  /**
   * Reference to columns that create single grouped column.
   * This is used when there are multiple row dimensions and values from all of them should be displayed in a single column.
   * @type {Column[]}
   * @optional
   */
  group: Column[] | null;

  /**
   * @constructor
   * @param {ColumnConfig} config
   *
   * @param {string} config.label - Column label that will be displayed in the table
   * @param {string} config.key - Column key that serves as an accessor for the value and should be unique among all columns
   * @param {ColumnType} config.type - Column type
   * @param {NativeDataType} config.dataType - Column data type that will be used for formatting of the value
   * @param {number} config.depth - Column depth in the column hierarchy
   * @param {Column[]} config.children - Column children that are nested under this column
   * @param {Column} config.parent - Reference to parent column that this column is nested under
   */
  constructor({
    label,
    key,
    type,
    dataType,
    depth = 0,
    children,
    parent,
    group
  }: ColumnConfig) {
    this.label = label;
    this.key = key;
    this.type = type;
    this.dataType = dataType ?? null;
    this.depth = depth;
    this.parent = parent ?? null;
    this.children = children ?? null;
    this.group = group ?? null;
  }

  /**
   * Add children columns to this column
   * @param {Column[]} childColumns
   * @returns {Column[]} all children columns
   * @public
   */
  public addChildren(childColumns: Column[]): Column[] {
    this.children = [
      ...this.children || [],
      ...childColumns
    ];

    return this.children;
  }

  /**
   * Get all leaf columns that are nested under this column
   * @returns {Column[]}
   * @public
   */
  public getLeafColumns(): Column[] {
    if (!this.children?.length) {
      return [this];
    }

    return this.children.reduce<Column[]>((acc, child) => {
      return [...acc, ...child.getLeafColumns()];
    }, []);
  }
}