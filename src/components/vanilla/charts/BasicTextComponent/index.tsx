import React from 'react';

import useFont from '../../../hooks/useFont';
import ChartContainer from '../../ChartContainer';
import { Inputs } from './BasicTextComponent.emb';

export default (props: Inputs) => {
  const { title, body } = props;

  useFont();

  return <ChartContainer title={title}>{body}</ChartContainer>;
};
