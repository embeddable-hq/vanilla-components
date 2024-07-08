import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'Text',
  label: 'Text',
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title text',
      category: 'Configure chart'
    },
    {
      name: 'body',
      type: 'string',
      label: 'Body',
      description: 'The body text',
      category: 'Configure chart'
    }
  ]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      title: inputs.title,
      body: inputs.body
    };
  }
});
