import { defineComponent } from '@embeddable.com/react';

import DateRangePicker from './DateRangePicker';

export const meta = {
  name: 'DateRangePicker',
  label: 'Date Range Picker',
  inputs: [
    {
      name: 'value',
      type: 'timeRange',
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
          type: 'time'
        },
        {
          name: 'to',
          type: 'time'
        },
        {
          name: 'dateRange',
          type: 'timeRange',
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
