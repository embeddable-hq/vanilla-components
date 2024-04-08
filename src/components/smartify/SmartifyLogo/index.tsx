import React from 'react';

import { Inputs } from './SmartifyLogo.emb';

// Define props interface to include a url string
interface LogoComponentProps {
  url: string;
}

export default (props: Inputs) => {
  const { logoUrl } = props;

  return (
    <div className="h-full flex justify-center items-center" style={{display: 'flex', maxWidth: '500px'}}>
      <img src={logoUrl} alt="Smartify Logo" />
    </div>
  );
};
