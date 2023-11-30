import { defineComponent } from '@embeddable.com/react';

import DateType from '../../types/Date.type.emb.js';
import DateRangeType from '../../types/DateRange.type.emb.js';

import DateRangePicker from './DateRangePicker.jsx';

export const meta = {
  name: 'DateRangePicker',
  label: 'Date range picker',
  inputs: [
    {
      name: 'value',
      type: DateRangeType,
      label: 'Value'
    }
  ],
  events: [
    {
      name: 'onChange',
      label: 'Change',
      properties: [
        {
          name: 'from',
          type: DateType
        },
        {
          name: 'to',
          type: DateType
        },
        {
          name: 'dateRange',
          type: DateRangeType,
          label: 'Date range'
        }
      ]
    }
  ]
};

export default defineComponent(DateRangePicker, meta, {
  props: ({ value }) => ({ value }),
  events: {
    onChange: (dateRange) => ({
      ...dateRange,
      dateRange
    })
  }
});
