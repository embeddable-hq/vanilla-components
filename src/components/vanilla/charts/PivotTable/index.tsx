import React from 'react';

import { DataResponse, Dimension, isDimension, Measure } from '@embeddable.com/core';

import Container from '../../Container';
import PivotTable from './PivotTable';
import { SortDirection } from '../../../../enums/SortDirection';
import { MeasureVisualizationFormat } from './enums/MeasureVisualizationFormat';

type Props = {
  title: string;
  results: DataResponse;
  rowValues: Dimension;
  columnValues: Dimension;
  metrics: Measure[];
  minColumnWidth?: number;
  minRowDimensionColumnWidth?: number;
  rowSortDirection?: SortDirection;
  columnSortDirection?: SortDirection;
  nullValueCharacter?: string;
  measureVisualizationFormat: MeasureVisualizationFormat;
  fontSize?: number;
};

export default ({ results, rowValues, columnValues, metrics, ...props }: Props) => (
  <Container
    {...props}
    className="overflow-auto"
  >
    {
      !results.isLoading && !results.error && (
        <PivotTable
          {...props}
          rawData={results.data!}
          columnDimensions={[columnValues].filter((metric) => isDimension(metric)) as Dimension[]}
          defaultColumnDimensionSortDirection={props.columnSortDirection}
          rowDimensions={[rowValues].filter((metric) => isDimension(metric)) as Dimension[]}
          defaultRowDimensionSortDirection={props.rowSortDirection}
          measures={metrics}
          fontSize={props.fontSize ? `${props.fontSize}px` : undefined}
        />
      )
    }
  </Container>
);