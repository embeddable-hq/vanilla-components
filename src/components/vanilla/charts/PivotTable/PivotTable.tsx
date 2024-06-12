import React, { useMemo } from 'react';
import { Dimension, Measure } from '@embeddable.com/core';
import clsx from 'clsx';
import TableHead, { Column } from './components/TableHead';
import TableRow from './components/TableRow';
import { WarningIcon } from '../../icons';
import { TableHeaderType } from './enums/TableHeaderType';
import { SortDirection } from '../../../../enums/SortDirection';
import { MeasureVisualizationFormat } from './enums/MeasureVisualizationFormat';
import TableCell from './components/TableCell';
import { COLORS } from '../../../constants';
import formatValue from '../../../util/format';

type Props = {
  rawData: Record<string, any>[];
  rowDimensions?: Dimension[];
  columnDimensions?: Dimension[];
  measures: Measure[];
  rowSortDirection?: SortDirection;
  columnSortDirection?: SortDirection;
  minColumnWidth?: number;
  minRowDimensionColumnWidth?: number;
  nullValueCharacter?: string;
  measureVisualizationFormat: MeasureVisualizationFormat;
}

function getDimensionValues(dataset: Record<string, any>, dimension: Dimension, sortDirection = SortDirection.ASCENDING): string[] {
  return [...new Set(dataset.map((record: any) => record[dimension.name]))].sort((a: string, b: string): number => {
    if (!a || !b) {
      return 0;
    }

    if (sortDirection === SortDirection.ASCENDING) {
      return a.localeCompare(b);
    } else {
      return b.localeCompare(a);
    }
  }) as string[];
}

export default ({
  rawData,
  columnDimensions,
  rowDimensions,
  measures,
  columnSortDirection,
  minColumnWidth,
  minRowDimensionColumnWidth,
  nullValueCharacter,
  measureVisualizationFormat,
}: Props) => {
  // TODO: This is fixed only for one col dimension for testing purposes, so let's support more nested dimensions
  const columnDimensionValues = useMemo(() => {
    if (columnDimensions?.length) {
      return getDimensionValues(rawData, columnDimensions[0], columnSortDirection);
    } else {
      return [];
    }
  }, [rawData, columnDimensions, columnSortDirection]);

  const tableColumns: Column[] | undefined = useMemo(() => {
    if (columnDimensions?.length) {
      return [
        ...(rowDimensions?.length ? [{
          label: columnDimensions[0].title,
          key: columnDimensions[0].name,
          type: TableHeaderType.DIMENSION,
          children: [{
            label: rowDimensions[0].title,
            key: rowDimensions[0].name,
            type: TableHeaderType.ROW_HEADER,
            minWidth: minRowDimensionColumnWidth || minColumnWidth || 'auto'
          }]
        }] : []),
        ...columnDimensionValues.map((dimensionValue) => ({
          label: dimensionValue,
          key: columnDimensions[0].name,
          type: TableHeaderType.DIMENSION,
          children: measures.map((measure) => ({
            label: measure.title,
            key: measure.name,
            type: TableHeaderType.MEASURE,
            minWidth: minColumnWidth || 'auto',
          }))
        }))
      ]
    } else if (rowDimensions?.length) {
      return [
        {
          label: rowDimensions[0].title,
          key: rowDimensions[0].name,
          type: TableHeaderType.ROW_HEADER,
          minWidth: minRowDimensionColumnWidth || minColumnWidth || 'auto',
        },
        ...(measures?.map((measure) => ({
          label: measure.title,
          key: measure.name,
          type: TableHeaderType.MEASURE,
          minWidth: minColumnWidth || 'auto',
        })) || [])
      ]
    }
  }, [rawData, columnDimensions, rowDimensions, measures]);

  let maxValuesOfMeasures = 0;

  const tableData = useMemo<Record<string, any>[]>(() => (
    // TODO: This is fixed only for one col dimension for testing purposes, so let's support more nested dimensions
    // FIXME: use custom groupBy function of library like lodash or underscore
    Object.groupBy(rawData, (dataRecord) => {
      if (measureVisualizationFormat !== MeasureVisualizationFormat.NUMERIC_VALUES_ONLY) {
        maxValuesOfMeasures = Math.max(maxValuesOfMeasures, ...(measures.map((measure) => parseFloat(dataRecord[measure.name]) || 0)));
      }

      return dataRecord[rowDimensions?.[0]?.name || '']
    })
  ), [rawData, rowDimensions, measureVisualizationFormat]);

  if (!tableColumns?.length) {
    return (
      <div className="h-full flex items-center justify-center font-embeddable text-sm">
        <WarningIcon />
        <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">Please define at least one data dimension</div>
      </div>
    )
  }

  return (
    <table className="min-w-full border-separate border-spacing-0 table-fixed">
      <thead className="text-[#333942] sticky top-0 z-20 bg-white">
        <TableHead columns={tableColumns} />
      </thead>

      <tbody className="overflow-y-auto">
      {
        Object.entries(tableData).map(([rowDimensionValue, rowData], rowIndex: number) => (
          <TableRow
            key={rowDimensionValue.replaceAll(' ', '-').toLowerCase()}
            columns={tableColumns}
            rowData={rowData}
            renderCell={(cellValue, column, groupedCollumns, columnIndex) => {
              const isRowHeader = column.type === TableHeaderType.ROW_HEADER;

              return (
                <TableCell
                  key={`${rowIndex}-${columnIndex}-${column.key}`}
                  isHeader={isRowHeader}
                  className={clsx('border-b', {
                    'text-left': isRowHeader,
                    'border-r': columnIndex === groupedCollumns.length - 1 || isRowHeader
                  })}
                >
                  <span>
                    {
                      cellValue === undefined || cellValue === null
                        ? nullValueCharacter
                        : formatValue(cellValue, {type: isRowHeader ? 'string' : 'number'})
                    }
                    {
                      cellValue && measureVisualizationFormat === MeasureVisualizationFormat.VALUE_BARS && !isRowHeader
                        ? (
                          <div
                            className="h-1 rounded-sm"
                            style={{
                              width: `${(parseFloat(cellValue) / maxValuesOfMeasures) * 80}%`,
                              backgroundColor: `${COLORS[measures.findIndex((measure) => measure.name === column.key) % COLORS.length]}`
                            }}
                          />
                        )
                        : null
                    }
                  </span>
                </TableCell>
              );
            }}
          />
        ))
      }
      </tbody>
    </table>
  )
}