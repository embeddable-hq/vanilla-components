import { defineOption, defineType } from '@embeddable.com/core';

const now = new Date();
defineOption('timeRange', {
  name: 'Last complete month',
  from: new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0),
  to: new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0),
});
defineOption('timeRange', {
  name: 'Next 7 days',
  from: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0), // Start of Today
  to: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 59), // End of next 7 days (just before midnight)
});
defineOption('timeRange', {
  name: 'Next 14 days',
  from: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0), // Start of Today
  to: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14, 23, 59, 59), // End of next 14 days (just before midnight)
});
defineOption('timeRange', {
  name: 'Next 30 days',
  from: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0), // Start of Today
  to: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30, 23, 59, 59), // End of next 30 days (just before midnight)
});
defineOption('timeRange', {
  name: 'Next month (full)',
  from: new Date(now.getFullYear(), now.getMonth() + 1, 1, now.getHours()),
  to: new Date(now.getFullYear(), now.getMonth() + 2, 1, 0, 0, 0),
});
defineOption('timeRange', {
  name: 'Last month',
  from: new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0),
  to: new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0),
});
defineOption('timeRange', {
  name: 'Last month (1 year ago)',
  from: new Date(now.getFullYear() - 1, now.getMonth() - 1, 1, 0, 0, 0),
  to: new Date(now.getFullYear() - 1, now.getMonth(), 1, 0, 0, 0),
});
defineOption('timeRange', {
  name: 'This year (full)',
  from: new Date(now.getFullYear(), 0, 1, 0, 0, 0), // January 1st, 00:00
  to: new Date(now.getFullYear(), 11, 31, 23, 59, 59), // December 31st, 23:59:59
});
defineOption('timeRange', {
  name: '1 year ago',
  from: new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0), // January 1st of last year
  to: new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59), // December 31st of last year
});
defineOption('timeRange', {
  name: '2 years ago',
  from: new Date(now.getFullYear() - 2, 0, 1, 0, 0, 0), // January 1st of 2 years ago
  to: new Date(now.getFullYear() - 2, 11, 31, 23, 59, 59), // December 31st of 2 years ago
});
defineOption('timeRange', {
  name: '3 years ago',
  from: new Date(now.getFullYear() - 3, 0, 1, 0, 0, 0), // January 1st of 3 years ago
  to: new Date(now.getFullYear() - 3, 11, 31, 23, 59, 59), // December 31st of 3 years ago
});
defineOption('timeRange', {
  name: '4 years ago',
  from: new Date(now.getFullYear() - 4, 0, 1, 0, 0, 0), // January 1st of 4 years ago
  to: new Date(now.getFullYear() - 4, 11, 31, 23, 59, 59), // December 31st of 4 years ago
});
defineOption('timeRange', {
  name: '5 years ago',
  from: new Date(now.getFullYear() - 5, 0, 1, 0, 0, 0), // January 1st of 5 years ago
  to: new Date(now.getFullYear() - 5, 11, 31, 23, 59, 59), // December 31st of 5 years ago
});
defineOption('timeRange', {
  name: '1 month ago',
  from: new Date(now.getFullYear(), now.getMonth() - 1, 1, now.getHours()),
  to: new Date(now.getFullYear(), now.getMonth(), 1, now.getHours()),
});
defineOption('timeRange', {
  name: '2 months ago',
  from: new Date(now.getFullYear(), now.getMonth() - 2, 1, now.getHours()),
  to: new Date(now.getFullYear(), now.getMonth() - 1, 1, now.getHours()),
});
defineOption('timeRange', {
  name: '3 months ago',
  from: new Date(now.getFullYear(), now.getMonth() - 3, 1, now.getHours()),
  to: new Date(now.getFullYear(), now.getMonth() - 2, 1, now.getHours()),
});
/*
defineOption('timeRange', {
  name: '4 months ago',
  from: new Date(now.getFullYear(), now.getMonth() - 4, 1, now.getHours()),
  to: new Date(now.getFullYear(), now.getMonth() - 3, 1, now.getHours()),
});
defineOption('timeRange', {
  name: '5 months ago',
  from: new Date(now.getFullYear(), now.getMonth() - 5, 1, now.getHours()),
  to: new Date(now.getFullYear(), now.getMonth() - 4, 1, now.getHours()),
});
defineOption('timeRange', {
  name: '6 months ago',
  from: new Date(now.getFullYear(), now.getMonth() - 6, 1, now.getHours()),
  to: new Date(now.getFullYear(), now.getMonth() - 5, 1, now.getHours()),
});
*/
export default 'timeRange';
