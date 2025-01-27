import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import Component from './index';

export const meta = {
    name: 'SmartifyLogo',
    label: 'Smartify Logo',
    category: 'Smartify: Report Fortmatting',
    inputs: [
        {
            name: 'logoUrl',
            type: 'string',
            label: 'Logo URL',
            description: 'Past the logo URL you want to have',
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