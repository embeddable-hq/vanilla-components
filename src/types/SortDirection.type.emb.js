import { defineOption, defineType } from '@embeddable.com/core';

const SortDirectionType = defineType('sortDirection', {
  label: 'Sort Direction',
  toString: (direction) => direction
});

defineOption(SortDirectionType, 'Ascending');

defineOption(SortDirectionType, 'Descending');

export default SortDirectionType;
