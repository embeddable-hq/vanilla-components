import { defineType } from '@embeddable.com/core';

export default defineType('timeRange', {
  label: 'Time Range',
  defaultValue: null,
  toString: (dateRange) => `${dateRange.from?.toDateString()} - ${dateRange.to?.toDateString()}`,
  deserialize: (json) => ({
    from: (json?.from && new Date(json.from)) || null,
    to: (json?.from && new Date(json.to)) || null,
    selectValue: json?.selectValue
  }),
  toNativeDataType: {
    string: (dateRange) => dateRange.selectValue,
    timeRange: (dateRange) =>
      dateRange.selectValue ?? [dateRange.from, dateRange.to].filter(Boolean)
  }
});
