import { Dimension, Measure } from '@embeddable.com/core';
import { createColumnKey, createGeneralKey } from '../utils/key';
import { Row } from './Row';

type RowRecordMap = {
  data: Record<string, string>;
  children: Map<string, RowRecordMap>;
}

class RowModel {
  readonly #dimensionalData: Record<string, string>[][];
  readonly #measures: Measure[];
  readonly #rowDimensions: Dimension[];
  readonly #columnDimensions: Dimension[];
  readonly #parsedTableData: RowRecordMap;
  readonly #aggregateRowDimensions: boolean;
  #rows: Row[] | null;
  #columnDimensionValues: Record<string, Set<string>> = {};

  constructor(
    dimensionalData: Record<string, string>[][],
    measures: Measure[],
    rowDimensions: Dimension[] = [],
    columnDimensions: Dimension[] = [],
    aggregateRowDimensions = true
  ) {
    this.#dimensionalData = dimensionalData;
    this.#measures = measures;
    this.#rowDimensions = rowDimensions || [];
    this.#columnDimensions = columnDimensions;
    this.#aggregateRowDimensions = aggregateRowDimensions;

    this.#parsedTableData = this.#dimensionalData.reduce((tableData, dimensionData, dimensionDataIndex) => {
      const appropriateRowDimensions = this.#aggregateRowDimensions ? this.#rowDimensions.slice(0, dimensionDataIndex + 1) : this.#rowDimensions;

      dimensionData.forEach(record => {
        const rowDataPath = this.#getDimensionValues(record, appropriateRowDimensions);
        const rowData: Record<string, any> = {
          ...this.#getRowDataKeyedByColumnDimensions(record),
          ...appropriateRowDimensions.reduce((acc, rowDimension) => ({
            ...acc,
            [rowDimension.name]: record[rowDimension.name]
          }), {}),
        };

        // If there is more than one row dimension, add the last row dimension as a group key for simpler rendering of collapsible rows
        if (appropriateRowDimensions.length && this.#rowDimensions.length > 1) {
          rowData['__group.key'] = record[appropriateRowDimensions.at(-1)!.name];
        }

        this.#insertDataToPath(tableData, rowDataPath, rowData);
      });

      return tableData;
    }, { data: {}, children: new Map() });

    // If there are no row dimensions, calculate col dimension values separately
    if (!this.#rowDimensions.length && this.#columnDimensions.length) {
      this.#dimensionalData.forEach((dimensionData) => {
        dimensionData.forEach(record => this.#getDimensionValues(record, this.#columnDimensions));
      });
    }

    this.#rows = null;
  }

  #getDimensionValues = (record: Record<string, string>, dimensions: Dimension[]) => {
    return dimensions?.map((dimension: Dimension) => {
      if (!this.#columnDimensionValues[dimension.name]) {
        this.#columnDimensionValues[dimension.name] = new Set();
      }
      this.#columnDimensionValues[dimension.name].add(record[dimension.name]);

      return record[dimension.name];
    });
  }

  #getRowDataKeyedByColumnDimensions = (record: Record<string, string>) => (
    this.#measures.reduce((rowData, measure) => ({
      ...rowData,
      [createColumnKey([...this.#getDimensionValues(record, this.#columnDimensions), measure.name])]: record[measure.name]
    }), {})
  )

  #insertDataToPath = (levelData: RowRecordMap, path: string[], data: Record<string, string>) => {
    if (!path.length) {
      levelData.data = { ...levelData.data, ...data };
      return;
    }

    const currentKey = createGeneralKey(path[0]);

    // Ensure the current level has the node for the key
    if (!levelData.children.has(currentKey)) {
      levelData.children.set(currentKey, {
        data: {},
        children: new Map()
      });
    }

    this.#insertDataToPath(levelData.children.get(currentKey)!, path.slice(1), data);
  }

  #getRowsFromParsedTableData = (tableDataRecord: RowRecordMap, depth = 0): Row[] => {
    const rows: Row[] = [];

    if (this.#rowDimensions.length) {
      for (const [, value] of tableDataRecord.children) {
        rows.push(new Row(
          value.data,
          this.#getRowsFromParsedTableData(value, depth + 1),
          depth
        ));
      }
    } else {
      rows.push(new Row(tableDataRecord.data));
    }

    return rows;
  }

  get rows() {
    if (!this.#rows) {
      this.#rows = this.#getRowsFromParsedTableData(this.#parsedTableData);
    }
    return this.#rows;
  }

  public getColumnDimensionValues(dimensionName: string) {
    return [...this.#columnDimensionValues[dimensionName]];
  }
}

export default RowModel;