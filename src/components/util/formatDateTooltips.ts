import { format } from 'date-fns';
import { DATE_DISPLAY_FORMATS } from '../constants';

export default function formatDateTooltips(lines: any[], granularity: string) {
	const linesList = lines.map((line) => line?.parsed?.x?.valueOf());
	const set = [...new Set(linesList)];
	if (set.length === 1 && set[0] === undefined) {
		console.log('Problem formatting date in tooltip');
		return;
	};
	return set.map((date) => format(new Date(date), DATE_DISPLAY_FORMATS[granularity]))
	.filter((v) => !!v);
};