import { DataResponse } from '@embeddable.com/core';
import { Dispatch, SetStateAction } from 'react';

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

const DownloadMenu: React.FC<Props> = (props) => {
  return null;
};

export default DownloadMenu;
