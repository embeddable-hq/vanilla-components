import React from 'react';
import { ReactDOM } from 'react';

import { Inputs } from './SmartifyHTML.emb'

// Define props interface to include a url string
type Props = Inputs & {
  SmartifyHTML: string;
}

export default (props: Inputs) => {
  const { SmartifyHTML } = props;

  
  return (
    <div
    dangerouslySetInnerHTML={{ __html: SmartifyHTML }}
  />
);
};