import { loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'BubbleMapChart',
  label: 'Bubble map chart',
  classNames: ['inside-card'],
  category: 'Charts: essentials',
  inputs: [
    {
      name: 'ds',
      type: 'dataset',
      label: 'Map Dataset',
      description: 'Dataset',
      defaultValue: false,
      category: 'Chart Data',
    },
    {
      name: 'bubblePlacement',
      type: 'dimension',
      label: 'Bubble Placement - Geolocation',
      config: {
        dataset: 'ds',
      },
      category: 'Chart Data',
    },
    {
      name: 'metric',
      type: 'measure',
      label: 'Metric',
      description: 'Metric to be displayed in the tooltip when a marker is hovered over',
      config: {
        dataset: 'ds',
      },
      category: 'Chart Data',
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
      name: 'marketTextColor',
      type: 'string',
      label: 'Marker Text Color',
      description: 'Color of the marker text',
      defaultValue: '#ffffff',
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
      name: 'markerClusterTextColor',
      type: 'string',
      label: 'Marker Cluster Text Color',
      description: 'Color of the marker cluster text',
      defaultValue: '#ffffff',
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
      name: 'customTileSet',
      type: 'string',
      label: 'Custom Tile Set',
      description: 'URL of custom tile set',
      category: 'Chart Settings',
      defaultValue: '',
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
      results: loadData({
        from: inputs.ds,
        limit: 5000,
        dimensions: [inputs.bubblePlacement],
        measures: [inputs.metric],
      }),
    };
  },
});
