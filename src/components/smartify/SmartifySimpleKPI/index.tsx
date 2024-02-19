import { Measure } from '@embeddable.com/core';
import { DataResponse } from '@embeddable.com/react';
import React, { useMemo } from 'react';

import useFont from '../../hooks/useFont';
import { Inputs } from './SmartifySimpleKPI.emb';
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
  useFont();

  const formattedValue = useMemo(() => {
    if (!props.value?.data?.length) return;

    if (!props.metric?.name) return;

    const value = props.value.data[0][props.metric.name];
    const num = parseFloat(value);

    if (value !== `${num}`) return value;

    const formatter = new Intl.NumberFormat('us');
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
    <div style={{ boxShadow: "0 1px 4px #1c1c2133", borderRadius: "5px" }}>
        <Card   decoration="top"
                decorationColor={props.colorDeco}>
            <Title>{props.title}</Title>
            <Metric>{formattedValue}</Metric>
            <Text className="space-x-2 mt-4">{props.description}</Text>
        </Card>
    </div>
  )
};
