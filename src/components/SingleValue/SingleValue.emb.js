import { isMeasure, isDimension, loadData } from '@embeddable.com/core';
import { defineComponent } from '@embeddable.com/react';

import SingleValue from './SingleValue';

export const meta = {
  name: 'SingleValue',
  label: 'Single Value',
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the chart'
    },
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset',
      description: 'Dataset',
      defaultValue: false
    },
    {
      name: 'property',
      type: 'measure',
      label: 'Property',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'prefix',
      type: 'string',
      label: 'Prefix',
      description: 'Prefix'
    },
    {
      name: 'suffix',
      type: 'string',
      label: 'Suffix',
      description: 'Suffix'
    }
  ],
  events: []
};

export default defineComponent(SingleValue, meta, {
  props: (props) => {
    return {
      ...props,
      value: loadData({
        from: props.ds,
        dimensions: isDimension(props.property) ? [props.property] : [],
        measures: isMeasure(props.property) ? [props.property] : []
      })
    };
  }
});
