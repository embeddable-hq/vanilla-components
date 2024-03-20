import { DataResponse } from '@embeddable.com/core';
import React, { useMemo } from 'react';

import format from '../../../util/format';
import Container from '../../Container';
import { WarningIcon } from '../../icons';

type Props = {
  value: DataResponse;
  title: string;
  prefix: string;
  suffix: string;
  metric: { name: string; meta?: object };
  dps: number;
};

export default (props: Props) => {
  const n = useMemo(() => {
    if (!props.value?.data?.length) return;

    if (!props.metric?.name) return;

    const n = props.value.data[0][props.metric?.name];

    if (isNaN(n)) return n;

    return format(n, {
      type: 'number',
      meta: props.metric?.meta,
      dps: props.dps
    });
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
        <div className="flex items-center justify-center font-embeddable text-[#333942] text-[40px] font-bold">
          {props.prefix}
          {n || 0}
          {props.suffix}
        </div>
      </div>
    </Container>
  );
};
