import { OrderBy, isDimension, isMeasure, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'BubbleMapChart',
  label: 'Bubble Map Chart',
  classNames: ['inside-card'],
  category: 'Charts: essentials',
  inputs: [
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset',
      description: 'Dataset',
      defaultValue: false,
      category: 'Chart data',
    },
    {
      name: 'bubblePlacement',
      type: 'dimension',
      label: 'Bubble Placement (lat/lng data) - NOT WORKING YET',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'metric',
      type: 'measure',
      label: 'Metric (bubble Size) - NOT WORKING YET',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'clusterRadius',
      type: 'number',
      label: 'Cluster Radius',
      description:
        'Radius within which markers are clustered. Larger value = fewer clusters with more items - REQUIRES REFRESH',
      defaultValue: 20,
      category: 'Chart Settings',
    },
    {
      name: 'markerColor',
      type: 'string',
      label: 'Marker Color',
      description: 'Color of the markers',
      defaultValue: '#6574C8',
      category: 'Chart Settings',
    },
    {
      name: 'markerClusterColor',
      type: 'string',
      label: 'Marker Cluster Color',
      description: 'Color of the marker clusters',
      defaultValue: '#8593e5',
      category: 'Chart Settings',
    },
    {
      name: 'showTooltips',
      type: 'boolean',
      label: 'Show tooltips',
      defaultValue: true,
      category: 'Chart Settings',
    },
    {
      name: 'toolTipValue',
      type: 'dimensionOrMeasure',
      label: 'Tooltip value - NOT WORKING YET',
      description: 'Value to show in the tooltip',
      category: 'Chart Settings',
    },
    {
      name: 'enableDownloadAsCSV',
      type: 'boolean',
      label: 'Show download as CSV',
      category: 'Export options',
      defaultValue: true,
    },
    {
      name: 'enableDownloadAsPNG',
      type: 'boolean',
      label: 'Show download as PNG',
      category: 'Export options',
      defaultValue: true,
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      dimensions: [inputs.bubblePlacement],
      measures: [inputs.metric],
    };
  },
});
