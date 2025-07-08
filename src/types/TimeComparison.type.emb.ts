import { defineOption, defineType } from '@embeddable.com/core';

const TimeComparisonType = defineType('timeComparison', {
  label: 'Time Comparison',
  optionLabel: (value) => value,
});

defineOption(TimeComparisonType, 'No comparison');
defineOption(TimeComparisonType, 'Previous period');
defineOption(TimeComparisonType, 'Previous week');
defineOption(TimeComparisonType, 'Previous month');
defineOption(TimeComparisonType, 'Previous quarter');
defineOption(TimeComparisonType, 'Previous year');

export default TimeComparisonType;
