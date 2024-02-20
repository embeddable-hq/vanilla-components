import { defineOption, defineType } from '@embeddable.com/core';

const TimeComparisonType = defineType('timeComparison', {
  label: 'Time Comparison',
  toString: (str) => str
});

defineOption(TimeComparisonType, 'No comparison');
defineOption(TimeComparisonType, 'Previous period');
defineOption(TimeComparisonType, 'Previous month');
defineOption(TimeComparisonType, 'Previous quarter');
defineOption(TimeComparisonType, 'Previous year');

export default TimeComparisonType;
