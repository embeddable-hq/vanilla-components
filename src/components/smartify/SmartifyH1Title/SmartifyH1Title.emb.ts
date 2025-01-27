import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import Component from './index';

export const meta = {
    name: 'SmartifyH1Title',
    label: 'Smartify H1 Title',
    category: 'Smartify: Report Fortmatting',
    inputs: [
        {
            name: 'title',
            type: 'string',
            label: 'Title',
            description: 'Insert desired title',
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