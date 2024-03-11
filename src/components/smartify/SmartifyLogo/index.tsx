import React from 'react';

import { Inputs } from './SmartifyLogo.emb';

// Define props interface to include a url string
interface LogoComponentProps {
  url: string;
}

export default (props: Inputs) => {
  const { logoUrl } = props;

  return (
    <div className="logo-container">
      <img src={logoUrl} alt="Smartify Logo" />
    </div>
  );
};
