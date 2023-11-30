import { defineType } from '@embeddable.com/core';

export default defineType('granularity', {
  label: 'Granularity',
  defaultValue: 'day',
  toString: (v) => v,
  deserialize: (v) => v,
  toNativeDataType: {
    string: (v) => v
  }
});
