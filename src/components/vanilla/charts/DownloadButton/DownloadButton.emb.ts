import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import { loadData, isMeasure, isDimension, Dimension, Measure } from '@embeddable.com/core';

import Component, { Props } from './index';

export const meta = {
  name: 'DownloadButton',
  label: 'Download Button',
  defaultWidth: 200,
  defaultHeight: 100,
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the button',
    },
    {
      name: 'description',
      type: 'string',
      label: 'Description',
      description: 'The description for the button',
    },
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset to download from'
    },
    {
      name: 'columns',
      type: 'dimensionOrMeasure',
      array: true,
      label: 'Columns to include in download',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'buttonLabel',
      type: 'string',
      label: 'Button label',
      description: 'The text to show on the button',
      defaultValue: 'Download'
    },
    {
      name: 'maxRows',
      type: 'number',
      label: 'Maximum number of rows to download',
      defaultValue: 100
    }
  ]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent<Props, typeof meta, { page: number }>(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.ds,
        dimensions: inputs.columns.filter((c) => isDimension(c)).map((c) => c as Dimension),
        measures: inputs.columns.filter((c) => isMeasure(c)).map((c) => c as Measure),
        limit: inputs.maxRows || undefined
      })
    };
  }
});