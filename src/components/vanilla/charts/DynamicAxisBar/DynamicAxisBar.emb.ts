import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import { loadData, isMeasure, isDimension, Dimension, Measure } from '@embeddable.com/core';

import Component, { Props } from './index';

export const meta = {
  name: 'DynamicAxisBar',
  label: 'Dynamic axis bar chart',
  classNames: ['inside-card'],
  category: 'To do',
  inputs: [
    {
        name: 'ds',
        type: 'dataset',
        label: 'Dataset to download from',
        category: 'Chart data'
    },
    {
        name: 'xAxis',
        type: 'dimension',
        label: 'Default X-axis',
        config: {
            dataset: 'ds',
        },
        category: 'Chart data'
    },
    {
        name: 'xAxisOptions',
        type: 'dimension',
        array: true,
        label: 'X-axis options',
        config: {
            dataset: 'ds'
        },
        category: 'Chart data'
    },
    {
        name: 'metrics',
        type: 'measure',
        array: true,
        label: 'Metrics',
        config: {
            dataset: 'ds'
        },
        category: 'Chart data'
    },
    {
      name: 'granularity',
      type: 'granularity',
      label: 'Granularity (for dates)',
      defaultValue: 'week',
      category: 'Variables to configure'
    },
    {
        name: 'title',
        type: 'string',
        label: 'Title',
        description: 'The title for the button',
        category: 'Settings'
    },
    {
        name: 'description',
        type: 'string',
        label: 'Description',
        description: 'The description for the button',
        category: 'Settings'
    }
  ]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent<Props, typeof meta, { page: number }>(Component, meta, {
  props: (inputs: Inputs<typeof meta>, [embState]) => {

    const selectedDimension = embState?.dimension?.title ? embState.dimension : inputs.xAxis;

    const isTimeDimension = selectedDimension.nativeType === 'time';
    

    return {
        ...inputs,
        reverseXAxis: isTimeDimension ? true : false,
        results: isTimeDimension 
            ? loadData({
                from: inputs.ds,
                timeDimensions: [
                  {
                    dimension: selectedDimension.name,
                    granularity: inputs.granularity
                  }
                ],
                measures: inputs.metrics,
                filters: [{
                    property: selectedDimension,
                    operator: 'notEquals',
                    value: [null]
                }],
                orderBy: [
                    { 
                        property: selectedDimension, 
                        direction: 'desc' 
                    }
                ]
            }) 
            : loadData({
                from: inputs.ds,
                dimensions: [selectedDimension],
                measures: inputs.metrics
            })
    };
  }
});