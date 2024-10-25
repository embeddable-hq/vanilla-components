import React from 'react';
import Title from '../../Title';
import Description from '../../Description';

type Props = {
  title?: string;
  body?: string;
  titleFontSize?: number;
  bodyFontSize?: number;
};

export default (props: Props) => {
  const { title, body, titleFontSize, bodyFontSize  } = props;

  const titleStyle = {
    fontSize: titleFontSize ? `${titleFontSize}px` : undefined,
    lineHeight: titleFontSize ? '1.2em' : undefined
  }

  const bodyStyle = {
    fontSize: bodyFontSize ? `${bodyFontSize}px` : undefined,
    lineHeight: bodyFontSize ? '1.2em' : undefined
  }


  return (
    <div>
      <Title title={title} style={titleStyle}/>
      <Description description={body} style={bodyStyle}/>
    </div>
  );
};