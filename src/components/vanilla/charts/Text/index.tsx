import React from 'react';

import Container from '../../Container';
import { Inputs } from './Text.emb';

export default (props: Inputs) => {
  const { title, body } = props;

  return <Container title={title}>{body}</Container>;
};
