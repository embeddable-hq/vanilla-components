import { Dimension, Measure, isDimension, isMeasure, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component, { Props } from './index';

export const meta = {
  name: 'DownloadButton',
  label: 'Download Button',
  defaultWidth: 200,
  defaultHeight: 100,
  category: 'Download options',
  inputs: [
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset to download from',
      category: 'Data',
    },
    {
      name: 'columns',
      type: 'dimensionOrMeasure',
      array: true,
      label: 'Columns to include in download',
      config: {
        dataset: 'ds',
      },
      category: 'Data',
    },
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the button',
      category: 'Settings',
    },
    {
      name: 'description',
      type: 'string',
      label: 'Description',
      description: 'The description for the button',
      category: 'Settings',
    },
    {
      name: 'buttonLabel',
      type: 'string',
      label: 'Button label',
      description: 'The text to show on the button',
      defaultValue: 'Download',
      category: 'Settings',
    },
    {
      name: 'maxRows',
      type: 'number',
      label: 'Maximum number of rows to download',
      defaultValue: 100,
      category: 'Settings',
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent<Props, typeof meta, { downloading: boolean }>(Component, meta, {
  props: (inputs: Inputs<typeof meta>, [state]) => {
    const downloading = state?.downloading === true;
    let results = {
      isLoading: false,
    };
    if (downloading) {
      results = loadData({
        from: inputs.ds,
        dimensions: inputs.columns.filter((c) => isDimension(c)).map((c) => c as Dimension),
        measures: inputs.columns.filter((c) => isMeasure(c)).map((c) => c as Measure),
        limit: inputs.maxRows || undefined,
      });
      return {
        ...inputs,
        results,
      };
    }
    return {
      ...inputs,
    };
  },
});
