import { DataResponse, TimeRange, Measure } from '@embeddable.com/core';
import React, { useMemo } from 'react';

import formatValue from '../../util/format';
import Container from '../../vanilla/Container';
import { WarningIcon } from '../../vanilla/icons';

import { LIGHTEST_FONT, LARGE_FONT_SIZE, REGULAR_FONT_SIZE } from '../../constants';

type Props = {
  results: DataResponse;
  prevResults?: DataResponse;
  prevTimeFilter?: TimeRange;
  title?: string;
  totalTitle?: string;
  usersTitle: string;
  prefix_one?: string;
  suffix_one?: string;
  prefix_two?: string;
  suffix_two?: string;
  metricTotal: Measure;
  metricUsers: Measure;
  dps?: number;
  fontSize?: number;
  showPrevPeriodLabel?: boolean;
};

export default (props: Props) => {
  const {
    results,
    prevResults,
    prevTimeFilter,
    metricTotal,
    metricUsers,
    totalTitle,
    usersTitle,
    dps,
    prefix_one,
    suffix_one,
    prefix_two,
    suffix_two,
    showPrevPeriodLabel,
  } = props;

  const calculateMetric = (metric: Measure) => {
    const value = parseFloat(results?.data?.[0]?.[metric.name] || 0);
    const prevValue = parseFloat(prevResults?.data?.[0]?.[metric.name] || 0);
    const percentage = prevValue || prevValue === 0 ? Math.round((value / prevValue) * 100) - 100 : null;

    return {
      value: formatValue(value.toString(), { type: 'number', dps, meta: metric?.meta }),
      percentage,
    };
  };

  const total = useMemo(() => calculateMetric(metricTotal), [results, prevResults, metricTotal, dps]);
  const users = useMemo(() => calculateMetric(metricUsers), [results, prevResults, metricUsers, dps]);

  const fontSize = props.fontSize || parseInt(LARGE_FONT_SIZE);
  const metaFontSize = Math.max(fontSize / 3, parseInt(REGULAR_FONT_SIZE));

  if (results?.error) {
    return (
      <div className="h-full flex items-center justify-center font-embeddable text-sm">
        <WarningIcon />
        <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">{results?.error}</div>
      </div>
    );
  }

  return (
    <Container {...props} className="overflow-y-hidden">
      <div className="flex flex-col h-full items-center justify-center font-embeddable text-[#333942] text-center leading-tight font-bold relative">
        <div className="flex flex-row justify-between w-full">
          {/* Metric Total */}
          <div className="flex flex-col items-center" style={{ width: '50%' }}>
            <div style={{ fontSize: `${metaFontSize}px`, marginBottom: '8px' }}>
              <p>{`${totalTitle || ''}`}</p>
            </div>
            <div style={{ fontSize: `${fontSize}px` }}>
              <p>{`${prefix_one || ''}${total.value || 0}${suffix_one || ''}`}</p>
            </div>
            {prevTimeFilter?.to && (
              <div
                className="font-normal text-center"
                style={{
                  color: total.percentage && total.percentage < 0 ? '#FF6B6C' : '#3BA99C',
                  fontSize: `${metaFontSize}px`,
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <Chevron
                  className={`${total.percentage && total.percentage < 0 ? 'rotate-180' : ''} h-[20px] w-[9px] min-w-[9px] mr-1.5`}
                />
                <span>
                  {total.percentage === Infinity
                    ? '∞'
                    : `${formatValue(`${Math.abs(total.percentage || 0)}`, { type: 'number', dps })}%`}
                </span>
                {showPrevPeriodLabel && prevTimeFilter?.relativeTimeString && (
                  <span style={{ color: `${LIGHTEST_FONT}` }}>&nbsp;vs {prevTimeFilter.relativeTimeString}</span>
                )}
              </div>
            )}
          </div>
          {/* Metric Users */}
          <div className="flex flex-col items-center" style={{ width: '50%' }}>
            <div style={{ fontSize: `${metaFontSize}px`, marginBottom: '8px' }}>
              <p>{`${usersTitle || ''}`}</p>
            </div>
            <div style={{ fontSize: `${fontSize}px` }}>
              <p>{`${prefix_two || ''}${users.value || 0}${suffix_two || ''}`}</p>
            </div>
            {prevTimeFilter?.to && (
              <div
                className="font-normal text-center"
                style={{
                  color: users.percentage && users.percentage < 0 ? '#FF6B6C' : '#3BA99C',
                  fontSize: `${metaFontSize}px`,
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <Chevron
                  className={`${users.percentage && users.percentage < 0 ? 'rotate-180' : ''} h-[20px] w-[9px] min-w-[9px] mr-1.5`}
                />
                <span>
                  {users.percentage === Infinity
                    ? '∞'
                    : `${formatValue(`${Math.abs(users.percentage || 0)}`, { type: 'number', dps })}%`}
                </span>
                {showPrevPeriodLabel && prevTimeFilter?.relativeTimeString && (
                  <span style={{ color: `${LIGHTEST_FONT}` }}>&nbsp;vs {prevTimeFilter.relativeTimeString}</span>
                )}
              </div>
            )}
          </div>
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