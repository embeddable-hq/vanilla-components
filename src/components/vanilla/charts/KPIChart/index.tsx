import { DataResponse } from '@embeddable.com/react';
import React, { useMemo } from 'react';

import format from '../../../util/format';
import Container from '../../Container';
import { WarningIcon } from '../../icons';
import { Inputs } from './KPIChart.emb';

type Props = Inputs & {
  value: DataResponse;
  prevValue?: DataResponse;
};

export default (props: Props) => {
  const { n, percentage } = useMemo(() => {
    if (!props.value?.data?.length) return { percentage: null };

    if (!props.metric?.name) return { percentage: null };

    const n = props.value.data[0][props.metric?.name];

    const num = parseFloat(n);

    if (n !== `${num}`) return { n, percentage: null };

    const prev = props.prevTimeFilter?.from && props.prevValue?.data?.[0]?.[props.metric?.name];

    return {
      percentage: prev ? Math.round((num / parseFloat(prev)) * 100) - 100 : null,
      n: format(n, {
        type: 'number',
        meta: props.metric?.meta
      })
    };
  }, [props]);
  console.log(1111, percentage, n, props);
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
        <div className="flex items-center justify-center font-embeddable text-[#333942] text-[40px] font-bold relative">
          {percentage !== null && (
            <i
              className="absolute left-0 -bottom-7 text-xs flex items-center"
              style={{ color: percentage < 0 ? '#FF6B6C' : '#3BA99C' }}
            >
              <Chevron className={`${percentage < 0 ? '' : 'rotate-180'} -mx-1`} />
              {percentage === Infinity ? '∞' : Math.abs(percentage)}%
            </i>
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
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.29289 7.29289C5.68342 6.90237 6.31658 6.90237 6.70711 7.29289L10 10.5858L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L10.7071 12.7071C10.3166 13.0976 9.68342 13.0976 9.29289 12.7071L5.29289 8.70711C4.90237 8.31658 4.90237 7.68342 5.29289 7.29289Z"
      fill="currentcolor"
    />
  </svg>
);
