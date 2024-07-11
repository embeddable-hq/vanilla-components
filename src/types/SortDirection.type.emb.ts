import { defineOption, defineType } from '@embeddable.com/core';
import { SortDirection } from '../enums/SortDirection';

const SortDirectionType = defineType('sortDirection', {
  label: 'Sort Direction',
  optionLabel: (direction) => direction.value
});

defineOption(SortDirectionType, { value: SortDirection.ASCENDING });

defineOption(SortDirectionType, { value: SortDirection.DESCENDING });

export default SortDirectionType;
