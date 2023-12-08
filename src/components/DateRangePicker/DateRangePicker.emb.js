import { defineComponent } from '@embeddable.com/react';

import DateRangePicker from './DateRangePicker';

export const meta = {
  name: 'DateRangePicker',
  label: 'Date Range Picker',
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: ''
    },
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
  ],
  variables: [
    {
      name: 'Date Range Value',
      type: 'timeRange',
      defaultValue: '',
      inputs: ['value'],
      events: [{ name: 'onChange', property: 'dateRange' }]
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
