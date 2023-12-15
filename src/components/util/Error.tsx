import React from 'react';

type Props = {
  msg: string;
};

export default (props: Props) => {
  return (
      <div>
        <h1>Error</h1>
        <div>{props.msg}</div>
      </div>
    )
}