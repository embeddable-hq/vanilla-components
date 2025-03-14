import { Value } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'ButtonWithVariables',
  label: 'Button using CSS Variables',
  defaultWidth: 300,
  defaultHeight: 300,
  category: '_Example',
  inputs: [
    {
      name: 'primary',
      type: 'string',
      label: 'Primary value',
      description: 'Primary value',
    },
    {
      name: 'secondary',
      type: 'string',
      label: 'Secondary value',
    },
    {
      name: 'text',
      type: 'string',
      label: 'text',

    }
  ]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => ({
    ...inputs
  })
});