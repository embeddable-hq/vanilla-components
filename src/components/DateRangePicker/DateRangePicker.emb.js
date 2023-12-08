import { defineComponent } from '@embeddable.com/react';

import DateRangePicker from './DateRangePicker';

export const meta = {
  name: 'DateRangePicker',
  label: 'Date Range Picker',
  inputs: [
    {
      name: 'value',
      type: 'timeRange',
      label: 'Initial value'
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
  ],
  variables: [
    {
      name: 'chosen date range',
      type: 'timeRange',
      defaultValue: null,
      inputs: ['value'],
      events: [{ name: 'onChange', property: 'dateRange' }]
    }
  ]
};

export default defineComponent(DateRangePicker, meta, {
  props: (inputs) => ({
    value: inputs.value
  }),
  events: {
    onChange: (timeRange) => ({
      from: timeRange.from,
      to: timeRange.to,
      timeRange: timeRange
    })
  }
});
