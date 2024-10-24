import { defineOption, defineType } from '@embeddable.com/core';

import { SortDirection } from '../enums/SortDirection';

const SortDirectionType = defineType('sortDirection', {
  label: 'Sort Direction',
  optionLabel: (direction: string) => direction,
});

defineOption(SortDirectionType, SortDirection.ASCENDING);

defineOption(SortDirectionType, SortDirection.DESCENDING);

export default SortDirectionType;
