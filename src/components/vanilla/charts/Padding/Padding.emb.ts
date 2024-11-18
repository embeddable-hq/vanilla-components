import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'Padding',
  label: 'Padding',
  category: 'Misc',
  defaultWidth: 50,
  defaultHeight: 50,
  inputs: [
    // no inputs
  ]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs
    };
  }
});
