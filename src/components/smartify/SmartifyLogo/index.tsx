import React from 'react';

import { Inputs } from './SmartifyLogo.emb';

// Define props interface to include a url string
interface LogoComponentProps {
  url: string;
}

export default (props: Inputs) => {
  const { logoUrl } = props;

  return (
<<<<<<< Updated upstream
    <div className="logo-container">
=======
    <div className="logo-container" style={{display: 'flex'}}>
>>>>>>> Stashed changes
      <img src={logoUrl} alt="Smartify Logo" />
    </div>
  );
};
