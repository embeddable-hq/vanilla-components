import { DataResponse } from '@embeddable.com/core';
import React, { Dispatch, SetStateAction } from 'react';

import IconDownloadAsCSV from '../icons/DownloadCSV';
import IconDownloadAsPNG from '../icons/DownloadPNG';
import downloadAsCSV from '../util/downloadAsCSV';
import downloadAsPNG from '../util/downloadAsPNG';

type Props = {
  element?: HTMLDivElement | null;
  props: {
    results?: DataResponse | DataResponse[];
    prevResults?: DataResponse;
  };
  setPreppingDownload?: Dispatch<SetStateAction<boolean>>;
  show?: boolean;
  type?: string;
};

const DownloadIcon: React.FC<Props> = ({ element, props, setPreppingDownload, show, type }) => {
  if (!show) return;

  const handleCSVClick = () => {
    // concatenate results data if results is an array (from pivot table)
    let data: DataResponse['data'] = [];
    if (Array.isArray(props.results)) {
      data = props.results.reduce((acc: DataResponse['data'] = [], result) => {
        if (result?.data) {
          acc.push(...result.data);
        }
        return acc;
      }, []);
    } else {
      data = props.results?.data;
    }
    downloadAsCSV(props, data, props.prevResults?.data, setPreppingDownload);
  };

  const handlePNGClick = () => {
    if (element) {
      const timestamp = Math.floor(new Date().getTime() / 1000);
      downloadAsPNG(element, `chart-${timestamp}.png`);
    }
  };

  if (type === 'csv') {
    return <IconDownloadAsCSV handleClick={handleCSVClick} />;
  } else if (type === 'png') {
    return <IconDownloadAsPNG handleClick={handlePNGClick} />;
  } else {
    return;
  }
};

export default DownloadIcon;
