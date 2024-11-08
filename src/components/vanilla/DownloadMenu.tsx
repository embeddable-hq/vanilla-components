import { DataResponse } from '@embeddable.com/core';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import IconDownloadCSV from '../icons/DownloadCSV';
import IconDownloadPNG from '../icons/DownloadPNG';
import IconVerticalEllipsis from '../icons/VerticalEllipsis';
import downloadAsCSV from '../util/downloadAsCSV';
import downloadAsPNG from '../util/downloadAsPNG';
import { ContainerProps } from './Container';

interface CSVProps extends ContainerProps {
  results?: DataResponse | DataResponse[];
  prevResults?: DataResponse;
}

type Props = {
  csvOpts?: {
    chartName: string;
    props: CSVProps;
  };
  enableDownloadAsCSV?: boolean;
  enableDownloadAsPNG?: boolean;
  pngOpts?: {
    chartName: string;
    element: HTMLDivElement | null;
  };
  preppingDownload: boolean;
  setPreppingDownload: Dispatch<SetStateAction<boolean>>;
};

const DownloadMenu: React.FC<Props> = (props) => {
  const {
    csvOpts,
    enableDownloadAsCSV,
    enableDownloadAsPNG,
    pngOpts,
    preppingDownload,
    setPreppingDownload,
  } = props;
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [isDownloadStarted, setIsDownloadStarted] = useState<boolean>(false);
  const refFocus = useRef<HTMLInputElement>(null);

  // Need a useEffect here because we want a render cycle to complete so the menu closes pre-html2canvas
  useEffect(() => {
    if (isDownloadStarted && preppingDownload) {
      if (!pngOpts) {
        console.error('No PNG options supplied');
        return;
      }
      const { chartName, element } = pngOpts;
      if (element) {
        // Strip out any characters that aren't alphanumeric or spaces
        const cleanedChartName = chartName.replace(/([^a-zA-Z0-9 ]+)/gi, '-');
        const timestamp = new Date().toISOString();
        // Without the timeout, the spinner doesn't show up due to html2canvas stopping everything
        // We can't clear this timeout because the download will be cancelled due to useEffect cleanup
        setTimeout(() => {
          downloadAsPNG(element, `${cleanedChartName}-${timestamp}.png`, setPreppingDownload);
        }, 200);
      }
      setIsDownloadStarted(false);
    }
  }, [isDownloadStarted, pngOpts, preppingDownload, setPreppingDownload]);

  // Handle CSV downloads using supplied options
  const handleCSVClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!csvOpts) {
      console.error('No CSV options supplied');
      return;
    }
    const { chartName, props: csvProps } = csvOpts;
    // concatenate results data if results is an array (from pivot table)
    let data: DataResponse['data'] = [];
    if (Array.isArray(csvProps.results)) {
      data = csvProps.results.reduce((acc: DataResponse['data'] = [], result) => {
        if (result?.data) {
          acc.push(...result.data);
        }
        return acc;
      }, []);
    } else {
      data = csvProps.results?.data;
    }
    downloadAsCSV(csvProps, data, csvProps.prevResults?.data, chartName, setPreppingDownload);
  };

  useEffect(() => {
    if (showMenu) {
      refFocus.current?.focus();
    }
  }, [showMenu]);

  // Handle the Click on the PNG icon - triggers the useEffect above
  const handlePNGClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setShowMenu(false);
    setPreppingDownload(true);
    setIsDownloadStarted(true);
  };

  // Toggle the download menu
  const handleSetShow = () => {
    setShowMenu(!showMenu);
  };

  // If neither CSV nor PNG downloads are enabled, show nothing
  if (!enableDownloadAsCSV && !enableDownloadAsPNG) {
    return null;
  }

  // If only CSV is enabled, skip the menu and show just the CSV download Icon
  if (enableDownloadAsCSV && !enableDownloadAsPNG) {
    return (
      <div className="absolute top-0 right-0 z-5 flex items-center justify-end space-x-2">
        <div onClick={handleCSVClick} className="cursor-pointer">
          {!preppingDownload && (
            <IconDownloadCSV className="cursor-pointer hover:opacity-100 opacity-50" />
          )}
        </div>
      </div>
    );
  }

  // If only PNG is enabled, skip the menu and show just the PNG download Icon
  if (!enableDownloadAsCSV && enableDownloadAsPNG) {
    return (
      <div className="absolute top-0 right-0 z-5 flex items-center justify-end space-x-2">
        <div onClick={handlePNGClick} className="cursor-pointer">
          {!preppingDownload && (
            <IconDownloadPNG className="cursor-pointer hover:opacity-100 opacity-50" />
          )}
        </div>
      </div>
    );
  }

  // Main Component
  return (
    <>
      <div className="absolute top-0 right-0 z-5 flex items-center justify-end space-x-2 ">
        <div onClick={handleSetShow} className="cursor-pointer relative w-3 flex justify-center">
          {!preppingDownload && (
            <IconVerticalEllipsis className="cursor-pointer hover:opacity-100 opacity-50" />
          )}
          {showMenu && (
            <>
              <div className="absolute bg-white flex items-center right-0 p-4 rounded shadow-md top-6 w-40 whitespace-nowrap">
                <ul>
                  <li className="mb-2">
                    <a
                      href="#"
                      onClick={handleCSVClick}
                      className="inline-block flex items-center hover:opacity-100 opacity-60"
                    >
                      <IconDownloadCSV className="cursor-pointer inline-block mr-2" /> Download CSV
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={handlePNGClick}
                      className="inline-block flex items-center hover:opacity-100 opacity-60"
                    >
                      <IconDownloadPNG className="cursor-pointer inline-block mr-2" /> Download PNG
                    </a>
                  </li>
                </ul>
              </div>
              <input
                type="text"
                ref={refFocus}
                onBlur={() =>
                  setTimeout(() => {
                    setShowMenu(false);
                  }, 200)
                }
                style={{ width: 1, height: 1, opacity: 0 }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DownloadMenu;
