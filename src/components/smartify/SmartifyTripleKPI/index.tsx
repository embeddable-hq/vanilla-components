import { Measure } from '@embeddable.com/core';
import { DataResponse } from '@embeddable.com/react';
import React, { useMemo } from 'react';
import useFont from '../../hooks/useFont';

import Spinner from '../../vanilla/Spinner';
import { WarningIcon } from '../../vanilla/icons';
import { Inputs } from './SmartifyTripleKPI.emb';

type Props = Inputs & {
  title_1?: string;
  title_2?: string;
  title_3?: string;
  value: DataResponse;
  metric_1: Measure;
  metric_2: Measure;
  metric_3: Measure;
  colorDeco: string;
  colorBg: string;
  prefix_1: string;
  suffix_1: string;
  prefix_2: string;
  suffix_2: string;
  prefix_3: string;
  suffix_3: string;
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

  //FORMATING MEASURES TO DISPLAY
  const formatValue1 = useMemo(() => { //Measure 1
    if (!props.value?.data?.length || !props.metric_1?.name) return;

    const rawValue = props.value.data[0][props.metric_1.name];
    return formatValue(rawValue);
  }, [props.value, props.metric_1]);
  
  const formatValue2 = useMemo(() => { //Measure 2
    if (!props.value?.data?.length || !props.metric_2?.name) return;

    const rawValue = props.value.data[0][props.metric_2.name];
    return formatValue(rawValue);
  }, [props.value, props.metric_2]);

  const formatValue3 = useMemo(() => { //Measure 3
    if (!props.value?.data?.length || !props.metric_3?.name) return;

    const rawValue = props.value.data[0][props.metric_3.name];
    return formatValue(rawValue);
  }, [props.value, props.metric_3]);

  useFont();

  if (props.value?.error) {
    return (
        <div className="h-full flex items-center justify-center font-embeddable text-sm">
            <WarningIcon></WarningIcon>
        <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">{props.value?.error}</div>
      </div>
    )
  }

  return (
    <div className='component-border h-full' style={{ border: `1px solid ${props.colorDeco}`, padding: '16px', borderRadius: '10px', backgroundColor: `${props.colorBg}` }}>
        <Spinner show={isLoading} />
        <h2 className="w-full text-[#333942] text-base font-bold font-embeddable justify-start flex leading-6"> {props.title_1} </h2>
        <div className="flex items-end justify-left font-embeddable text-[#333942] text-[40px] font-bold">
            {props.prefix_1}
            { formatValue1 || 0}
            {props.suffix_1}
        </div>
        <h3 className="w-full text-[12px] text-[#333942] text-base font-bold justify-start flex"> {props.title_2} </h3>
        <div className="flex items-left justify-left font-embeddable text-[#333942] text-[32px] font-bold">
            {props.prefix_2}
            { formatValue2 || 0}
            {props.suffix_2}
        </div>
        <h3 className="w-full text-[12px] text-[#333942] text-base font-bold justify-start flex"> {props.title_3} </h3>
        <div className="flex items-left justify-left font-embeddable text-[#333942] text-[32px] font-bold">
            {props.prefix_3}
            { formatValue3 || 0}
            {props.suffix_3}
        </div>
        <p style={{ display: 'flex', fontSize: '14px', marginBottom: '2px', color: '#494949'}}> {props.description} </p>
    </div>
  )
};
