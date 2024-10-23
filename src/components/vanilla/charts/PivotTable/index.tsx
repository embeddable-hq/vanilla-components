import { DataResponse, Dimension, Measure, isDimension } from '@embeddable.com/core';
import React from 'react';

import { SortDirection } from '../../../../enums/SortDirection';
import Container from '../../Container';
import PivotTable from './PivotTable';
import { MeasureVisualizationFormat } from './enums/MeasureVisualizationFormat';

type DynamicDimensionsData = {
  [key in `resultsDimension${number}`]: DataResponse;
};

type Props = {
  title: string;
  description?: string;
  rowValues?: Dimension[];
  columnValues?: Dimension[];
  metrics: Measure[];
  minColumnWidth?: number;
  minRowDimensionColumnWidth?: number;
  rowSortDirection?: SortDirection;
  columnSortDirection?: SortDirection;
  nullValueCharacter?: string;
  isRowGroupDefaultExpanded?: boolean;
  measureVisualizationFormat: MeasureVisualizationFormat;
  fontSize?: number;
  aggregateRowDimensions?: boolean;
} & DynamicDimensionsData;

export default ({ rowValues, columnValues, metrics, ...props }: Props) => {
  const results: DataResponse[] = [];

  if (rowValues?.length && props.aggregateRowDimensions) {
    rowValues?.forEach((rowDimension, index) => {
      if (props[`resultsDimension${index}`]) {
        results.push(props[`resultsDimension${index}`]);
      }
    });
  } else {
    results.push(props.resultsDimension0);
  }

  return (
    <Container
      title={props.title}
      results={results}
      description={props.description}
      className="overflow-auto"
    >
      {results.every((result) => result && !result.isLoading && !result.error) && (
        <PivotTable
          {...props}
          data={results.map((result) => result.data!)}
          columnDimensions={columnValues}
          defaultColumnDimensionSortDirection={props.columnSortDirection}
          rowDimensions={rowValues?.filter((metric) => isDimension(metric)) as Dimension[]}
          defaultRowDimensionSortDirection={props.rowSortDirection}
          measures={metrics}
          fontSize={props.fontSize ? `${props.fontSize}px` : undefined}
        />
      )}
    </Container>
  );
};
