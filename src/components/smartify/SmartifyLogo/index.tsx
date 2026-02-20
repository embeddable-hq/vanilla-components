import React from 'react';

//import { Inputs } from './SmartifyLogo.emb';

type Props = {
  logoUrl?: string;
};

export default (props: Props) => {
  const { logoUrl } = props;

  return (
    <div className="h-full flex justify-center items-center" style={{display: 'flex'}}>
      <img src={logoUrl} alt="Smartify Logo" />
    </div>
  );
};
