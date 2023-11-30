import { defineEditor } from '@embeddable.com/react';
import GranularityType from '../types/Granularity.type.emb.js';

import GranularityDropdown from '../components/GranularityDropdown/GranularityDropdown';

export const meta = {
  name: 'GranularityEditor',
  label: 'Granularity',
  type: GranularityType
};

export default defineEditor(GranularityDropdown, meta, {
  inputs: (value, setter) => ({
    value,
    onChange: (val) => setter(val)
  })
});
