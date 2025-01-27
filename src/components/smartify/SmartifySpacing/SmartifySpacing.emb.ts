import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import Component from './index';

export const meta = {
  name: 'SmartifySpacing',
  label: 'Smartify Spacing',
  category: 'Smartify: Report Fortmatting',
  inputs: [
    {
      name: 'spacing',
      type: 'number',
      label: 'Margin Top and Bottom',
      description: 'Total pixels that will be added above and below the separator line',
      category: 'Configure chart',
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
    };
  },
});