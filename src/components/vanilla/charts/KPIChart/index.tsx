import { DataResponse, TimeRange } from '@embeddable.com/core';
import React, { useMemo } from 'react';

import formatValue from '../../../util/format';
import Container from '../../Container';
import { WarningIcon } from '../../icons';

type Props = {
  value: DataResponse;
  prevValue?: DataResponse;
  prevTimeFilter?: TimeRange;
  title: string;
  prefix: string;
  suffix: string;
  metric: { name: string; meta?: object };
  dps: number;
};

export default (props: Props) => {
  const { n, percentage } = useMemo(() => {
    if (!props.value?.data?.length) return { percentage: null };

    if (!props.metric?.name) return { percentage: null };

    const n = props.value.data[0][props.metric?.name];

    const num = parseFloat(n);

    if (n !== `${num}`) return { n, percentage: null };

    const prev = props.prevValue?.data?.[0]?.[props.metric?.name];

    return {
      percentage: prev ? Math.round((num / parseFloat(prev)) * 100) - 100 : null,
      n: formatValue(n, {
        type: 'number',
        meta: props.metric?.meta,
        dps: props.dps
      })
    };
  }, [props]);

  if (props.value?.error) {
    return (
      <div className="h-full flex items-center justify-center font-embeddable text-sm">
        <WarningIcon />
        <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">{props.value?.error}</div>
      </div>
    );
  }

  return (
    <Container className="overflow-y-hidden" title={props.title} results={props.value}>
      <div className="relative grow items-center justify-center flex min-h-[40px]">
        <div className="flex items-center justify-center font-embeddable text-[#333942] text-[44px] font-bold relative -mt-[10px]">
          {props.prevTimeFilter?.to && percentage !== null && (
            <span
              className="absolute left-0 -bottom-[38px] w-full justify-center flex items-center text-[16px]"
              style={{ color: percentage < 0 ? '#FF6B6C' : '#3BA99C' }}
            >
              <Chevron
                className={`${
                  percentage < 0 ? 'rotate-180' : ''
                } h-[20px] w-[9px] min-w-[9px] mr-1.5`}
              />
              {percentage === Infinity ? '∞' : formatValue(`${Math.abs(percentage)}`, 'number')}%
            </span>
          )}
          {props.prefix}
          {n || 0}
          {props.suffix}
        </div>
      </div>
    </Container>
  );
};

export const Chevron = ({ className }: { className?: string }) => (
  <svg
    className={className || ''}
    width="16"
    height="14"
    viewBox="0 0 16 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.14028 0.753268C7.5422 0.0998221 8.4578 0.099822 8.85972 0.753268L15.8366 12.0964C16.2727 12.8054 15.7846 13.7369 14.9769 13.7369H1.02308C0.215416 13.7369 -0.272737 12.8054 0.163359 12.0964L7.14028 0.753268Z"
      fill="currentcolor"
    />
  </svg>
);
