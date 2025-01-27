import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import Component from './index';

export const meta = {
    name: 'SmartifyH3Title',
    label: 'Smartify H3 Title',
    category: 'Smartify: Report Fortmatting',
    inputs: [
        {
            name: 'title',
            type: 'string',
            label: 'Title',
            description: 'Insert desired title',
            category: 'Configure chart'
        },
        {
          name: 'spacing',
          type: 'number',
          label: 'Margin Top and Bottom',
          description: 'Total pixels that will be added above and below the separator line',
          defaultValue: 12,
          category: 'Configure chart'
        }
    ]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs
    };
  }
});