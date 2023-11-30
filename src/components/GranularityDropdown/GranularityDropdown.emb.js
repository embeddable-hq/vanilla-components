import { defineComponent } from '@embeddable.com/react';

import GranularityType from '../../types/Granularity.type.emb.js';

import GranularityDropdown from './GranularityDropdown';

export const meta = {
  name: 'GranularityDropdown',
  label: 'Granularity Dropdown',
  events: [
    {
      name: 'onChange',
      label: 'Change',
      properties: [
        {
          name: 'granularity',
          type: GranularityType
        }
      ]
    }
  ]
};

export default defineComponent(GranularityDropdown, meta, {
  props: ({ value }) => ({ value }),
  events: {
    onChange: (granularity) => ({ granularity })
  }
});
