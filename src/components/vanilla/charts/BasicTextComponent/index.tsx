import React from 'react';
import React, { useRef } from 'react';
import Loading from '../../../util/Loading'
import Error from '../../../util/Error'
import { COLORS, EMB_FONT, SMALL_FONT_SIZE, LIGHT_FONT } from '../../../constants';
import { WarningIcon } from '../../icons';
import Spinner from '../../Spinner';
import Title from '../../Title';


type Props = {
  title?: string;
  body?: string;
};

export default (props: Props) => {

const { title, body } = props;

  return (
    <div className="h-full relative font-embeddable text-sm flex flex-col">
      <Title title={title} />
      <div className="relative grow">
        <p>{body}</p>
      </div>
    </div>
  );
};
