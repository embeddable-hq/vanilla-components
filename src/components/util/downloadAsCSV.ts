import { Measure, Dimension, DimensionOrMeasure } from '@embeddable.com/core';

type Props = {
	[key: string]: Measure |  Measure[] | Dimension | Dimension[] | DimensionOrMeasure[] | any;
};

type DataRow = {
	[attr: string]: any;
};

type SetLoadingState = (state: boolean) => void;


export default (props: Props, data?: DataRow[], prevData?: DataRow[], setLoadingState?: SetLoadingState) => {

	if (!data) { return; }

	setLoadingState?.(true);

	const titlesByName = (() => {
		const titles: { [key: string]: string } = {};
		const extractTitle = (input: any): void => {
			if(['measure', 'dimension'].includes(input?.__type__)) {
				titles[input.name] = input.title;
			}
		}
		for (const [key, value] of Object.entries(props)) {
			if(Array.isArray(value)) {
				value.forEach(extractTitle)
			} else {
				extractTitle(value);
			}
		}
		console.log('titles', titles)
		return titles;
	})();

	const arrayToCsv = (data: DataRow[] ) => {
		return data.map(row =>
			row
				.map(String)  // convert every value to String
				.map((v:string) => v.replaceAll('"', '""'))  // escape double quotes
				.map((v:string) => `"${v}"`)  // quote it
				.join(',')  // comma-separated
			).join('\r\n');  // rows starting on new lines
	}

	const downloadBlob = (content: any, filename: string, contentType: string) => {
		// Create a blob
		const blob = new Blob([content], { type: contentType });
		const url = URL.createObjectURL(blob);

		// Create a link to download it
		const pom = document.createElement('a');
		pom.href = url;
		pom.setAttribute('download', filename);
		pom.click();
		if (setLoadingState) setLoadingState(false);
	}

	const prepCSV = () => {
		const rows = [];
		const columns = Object.keys(data[0]);
		rows.push(columns.map(c => titlesByName[c] || c)); //title row

		data?.forEach(row => {
			const rowValues = columns.map(c => row[c]);
			rows.push(rowValues);
		})
		prevData?.forEach(row => {
			const rowValues = columns.map(c => row[c]);
			rows.push(rowValues);
		})
		return arrayToCsv(rows);
	}
   
    return setTimeout(() => {  downloadBlob(prepCSV(), 'export.csv', 'text/csv;charset=utf-8;'); }, 200); //timeout set to indicate that the download is in progress (if instant it can appear to the user that it hasn't been successful)

}