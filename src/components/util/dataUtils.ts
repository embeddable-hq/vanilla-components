import { DataResponse, Measure } from '@embeddable.com/core';

type Metrics = Measure[] | undefined;

export function containsFractions(results:DataResponse | undefined, metrics: Metrics) {
    return results?.data?.some(row =>
        metrics?.find(metric => !Number.isInteger(row[metric.name]))
    ) ?? false; // Return false if data or metricsGroup is undefined
  }