import { Dataset, Measure } from '@embeddable.com/core';
import { DataResponse } from '@embeddable.com/react';
import React, { useMemo } from 'react';

import useFont from '../../hooks/useFont';
import { Inputs } from './SmartifyDubleKPI.emb';
import Spinner from '../../vanilla/Spinner';
import { WarningIcon } from '../../vanilla/icons';

type Props = Inputs & {
  title?: string;
  sub_title?: string;
  value: DataResponse;
  metric_total: Measure;
  metric_users: Measure;
  colorDeco: string;
  colorBg: string;
  prefix_1: string;
  suffix_1: string;
  prefix_2: string;
  suffix_2: string;
  description: string;
};

// Utility function to format any given value as a string
const formatValue = (value: any) => {
    const num = parseFloat(value);
    if (value !== `${num}`) return value; // Return the original value if it's not a number

    const formatter = new Intl.NumberFormat('en-US');
    return formatter.format(num); // Return formatted number
};

export default (props: Props) => {
  const { isLoading, error, data } = props.value || {};
  const noData = props.value && !isLoading && !data?.length;

  // Assume you want to format a different variable, e.g., `props.anotherMetric`
  const formattedTotalValue = useMemo(() => {
    if (!props.value?.data?.length || !props.metric_total?.name) return;

    const rawValue = props.value.data[0][props.metric_total.name];
    return formatValue(rawValue);
  }, [props.value, props.metric_total]); // Use props.anotherMetric as a dependency
  const formattedUserValue = useMemo(() => {
    if (!props.value?.data?.length || !props.metric_users?.name) return;

    const rawValue = props.value.data[0][props.metric_users.name];
    return formatValue(rawValue);
  }, [props.value, props.metric_users]); // Use props.anotherMetric as a dependency
    

  useFont();

  if (props.value?.error) {
    return (
      <div className="h-full flex items-center justify-center font-embeddable text-sm">
        <WarningIcon></WarningIcon>
        <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">{props.value?.error}</div>
      </div>
    );
  }

  return (
    <div className='component-border h-full' style={{ border: `1px solid ${props.colorDeco}`, padding: '16px', borderRadius: '10px', backgroundColor: `${props.colorBg}` }}>
        <Spinner show={isLoading}></Spinner>
        <h2 className="w-full text-[#333942] text-base font-bold font-embeddable justify-start flex leading-6"> {props.title} </h2>
        <div className="flex items-end justify-left font-embeddable text-[#333942] text-[40px] font-bold">
          {props.prefix_1}
          { formattedTotalValue || 0 }
          {props.suffix_1}
        </div>
        <h3 className="w-full text-[12px] text-[#333942] text-base font-bold justify-start flex"> {props.sub_title} </h3>
        <div className="flex items-left justify-left font-embeddable text-[#333942] text-[32px] font-bold">
          {props.prefix_2}
          { formattedUserValue || 0 }
          {props.suffix_2}
        </div>
        <p style={{ display: 'flex', fontSize: '14px', marginBottom: '2px', color: '#494949'}}>
        {props.description}
      </p>
    </div>
  )
};
