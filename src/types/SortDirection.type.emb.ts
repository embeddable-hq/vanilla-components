import { defineOption, defineType } from '@embeddable.com/core';

const SortDirectionType = defineType('sortDirection', {
  label: 'Sort Direction',
  optionLabel: (direction) => direction.value
});

defineOption(SortDirectionType, {value: 'Ascending'});

defineOption(SortDirectionType, {value: 'Descending'});

export default SortDirectionType;
