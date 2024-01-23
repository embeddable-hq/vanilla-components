import { DatePicker } from '@mui/x-date-pickers';
import React from 'react';

import MUI from '../../MUI';
import '../../index.css';
import { Inputs } from './MaterialDatePicker.emb';

export type Props = Inputs & {};

export default (props: Props) => {
  return (
    <MUI>
      <DatePicker />
    </MUI>
  );
};
