import { Measure } from '@embeddable.com/core';
import { DataResponse } from '@embeddable.com/react';
import React, { useMemo } from 'react';

import useFont from '../../hooks/useFont';
import { Inputs } from './SmartifySimpleKPI.emb';
<<<<<<< Updated upstream
import { Card, Metric, Text, Title } from '@tremor/react';
import { WarningIcon } from '../../vanilla/icons';

type Props = Inputs & {
  title?: string;
  value: DataResponse;
  metric: Measure;
  colorDeco: string;
  description: string;
};

export default (props: Props) => {
=======
//import { Card, Metric, Text, Title } from '@tremor/react';
import { WarningIcon } from '../../vanilla/icons';
import Spinner from '../../vanilla/Spinner';
//import { Title } from 'chart.js';

type Props = Inputs & {
  title?: string;
  value?: DataResponse;
  metric: Measure;
  colorDeco: string;
  colorBg: string;
  description: string;
  prefix: string;
  suffix: string;
};

export default (props: Props) => {
  const { isLoading, error, data } = props.value || {};
  const noData = props.value && !isLoading && !data?.length;

>>>>>>> Stashed changes
  useFont();

  const formattedValue = useMemo(() => {
    if (!props.value?.data?.length) return;

    if (!props.metric?.name) return;

    const value = props.value.data[0][props.metric.name];
    const num = parseFloat(value);

    if (value !== `${num}`) return value;

<<<<<<< Updated upstream
    const formatter = new Intl.NumberFormat('us');
=======
    const formatter = new Intl.NumberFormat('en-US');
>>>>>>> Stashed changes
    return formatter.format(num);
  }, [props.value, props.metric]);

  if (props.value?.error) {
    return (
      <div className="h-full flex items-center justify-center font-embeddable text-sm">
        <WarningIcon />
        <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">{props.value?.error}</div>
      </div>
    );
  }

  return (
<<<<<<< Updated upstream
    <div style={{ boxShadow: "0 1px 4px #1c1c2133", borderRadius: "5px" }}>
        <Card   decoration="top"
                decorationColor={props.colorDeco}>
            <Title>{props.title}</Title>
            <Metric>{formattedValue}</Metric>
            <Text className="space-x-2 mt-4">{props.description}</Text>
        </Card>
=======
    <div className="component-border h-full" style={{ border: `1px solid ${props.colorDeco}`, padding: '16px', borderRadius: '10px', backgroundColor: `${props.colorBg}` }}>
      <Spinner show={isLoading}></Spinner>
      <h2 className="w-full text-[#333942] text-base font-bold font-embeddable justify-start flex leading-6">{props.title}</h2>
      <div className="flex items-left justify-left font-embeddable text-[#333942] text-[40px] font-bold">
          {props.prefix}
          {formattedValue || 0}
          {props.suffix}
        </div>  
      <p style={{ display: 'flex', fontSize: '14px', marginBottom: '2px', color: '#494949'}}>
        {props.description}
      </p>
>>>>>>> Stashed changes
    </div>
  )
};
