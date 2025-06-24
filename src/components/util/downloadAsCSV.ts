import { DataResponse } from '@embeddable.com/core';
import { ContainerProps } from '../vanilla/Container.types';

type DataResponseData = { [key: string]: any };

type Input = {
  [key: string]: any;
};

interface Props extends ContainerProps {
  results?: DataResponse | DataResponse[];
  prevResults?: DataResponse;
}

const downloadAsCSV = (
  props: Props,
  data: DataResponseData[] | undefined,
  prevData: DataResponseData[] | undefined,
  chartName: string,
  setLoadingState?: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  if (setLoadingState) {
    setLoadingState(true);
  }

  // If there's no data, we can't export anything
  if (!data) {
    if (setLoadingState) setLoadingState(false);
    return;
  }

  // Strip out any characters that aren't alphanumeric or spaces
  const cleanedChartName = chartName.replace(/([^a-zA-Z0-9 ]+)/gi, '-');

  const titlesByName = (() => {
    const titles: { [key: string]: string } = {};
    const extractTitle = (input: Input) => {
      if (['measure', 'dimension'].includes(input?.__type__)) {
        titles[input.name] = input.title;
      }
    };
    for (const [key, value] of Object.entries(props)) {
      if (Array.isArray(value)) {
        value.forEach(extractTitle);
      } else {
        extractTitle(value);
      }
    }
    return titles;
  })();

  const arrayToCsv = (arrayData: any[][]) => {
    return arrayData
      .map(
        (row) =>
          row
            .map(String) // convert every value to String
            .map((v) => v.replaceAll('"', '""')) // escape double quotes
            .map((v) => `"${v}"`) // quote it
            .join(','), // comma-separated
      )
      .join('\r\n'); // rows starting on new lines
  };

  const downloadBlob = (content: string, filename: string, contentType: string) => {
    // Create a blob
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);

    // Create a link to download it
    const pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', filename);
    pom.click();
    if (setLoadingState) setLoadingState(false);
  };

  const prepCSV = () => {
    const rows = [];
    const columns = Object.keys(data[0]);
    rows.push(columns.map((c) => titlesByName[c] || c)); //title row

    data?.map((row) => {
      const rowValues = columns.map((c) => row[c]);
      rows.push(rowValues);
    });
    prevData?.map((row) => {
      const rowValues = columns.map((c) => row[c]);
      rows.push(rowValues);
    });
    return arrayToCsv(rows);
  };

  return setTimeout(() => {
    const timestamp = new Date().toISOString();

    downloadBlob(prepCSV(), `${cleanedChartName}-${timestamp}.csv`, 'text/csv;charset=utf-8;');
  }, 200); //timeout set to indicate that the download is in progress (if instant it can appear to the user that it hasn't been successful)
};

export default downloadAsCSV;
