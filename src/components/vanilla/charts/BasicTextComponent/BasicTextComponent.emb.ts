import { defineComponent } from '@embeddable.com/react';
import Component from './index';

export const meta = {
  name: 'BasicTextComponent',
  label: 'Basic Text',
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title text'
    },
    {
      name: 'body',
      type: 'string',
      label: 'Body',
      description: 'The body text'
    },
  ]
};

export default defineComponent(Component, meta, {
  props: (inputs) => {
    return {
      title: inputs.title,
      body: inputs.body
    };
  }
});