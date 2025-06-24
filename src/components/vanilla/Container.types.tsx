import { DataResponse } from '@embeddable.com/core';
import { Size } from '../hooks/useResize';

export type ContainerProps = {
  childContainerClassName?: string;
  className?: string;
  description?: string;
  downloadAllFunction?: () => void;
  enableDownloadAsCSV?: boolean;
  enableDownloadAsPNG?: boolean;
  onResize?: (size: Size) => void;
  prevResults?: DataResponse;
  results?: DataResponse | DataResponse[];
  setResizeState?: (resizing: boolean) => void;
  title?: string;
};
