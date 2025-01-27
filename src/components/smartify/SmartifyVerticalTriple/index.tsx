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
  oneTitle?: string;
  twoTitle?: string;
  threeTitle?: string;
  prefix_one?: string;
  suffix_one?: string;
  prefix_two?: string;
  suffix_two?: string;
  prefix_three?: string;
  suffix_three?: string;
  metricOne: Measure;
  metricTwo: Measure;
  metricThree: Measure;
  dps?: number;
  fontSize?: number;
  showPrevPeriodLabel?: boolean;
};

export default (props: Props) => {
  const {
    results,
    prevResults,
    prevTimeFilter,
    metricOne,
    metricTwo,
    metricThree,
    oneTitle,
    twoTitle,
    threeTitle,
    dps,
    prefix_one,
    suffix_one,
    prefix_two,
    suffix_two,
    prefix_three,
    suffix_three,
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

  const m_one = useMemo(() => calculateMetric(metricOne), [results, prevResults, metricOne, dps]);
  const m_two = useMemo(() => calculateMetric(metricTwo), [results, prevResults, metricTwo, dps]);
  const m_three = useMemo(() => calculateMetric(metricThree), [results, prevResults, metricThree, dps]);

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
        {/* Metric One */}
        <div className="flex flex-col items-center mb-4">
          <div style={{ fontSize: `${metaFontSize}px`, marginBottom: '8px' }}>
            <p>{`${oneTitle || ''}`}</p>
          </div>
          <div style={{ fontSize: `${fontSize}px` }}>
            <p>
              {`${prefix_one || ''}${m_one.value || 0}`}
              <span style={{ fontSize: `${metaFontSize}px` }}>{`${suffix_one || ''}`}</span>
            </p>
          </div>
          {prevTimeFilter?.to && (
            <div
              className="font-normal text-center"
              style={{
                color: m_one.percentage && m_one.percentage < 0 ? '#FF6B6C' : '#3BA99C',
                fontSize: `${metaFontSize}px`,
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <Chevron
                className={`${m_one.percentage && m_one.percentage < 0 ? 'rotate-180' : ''} h-[20px] w-[9px] min-w-[9px] mr-1.5`}
              />
              <span>
                {m_one.percentage === Infinity
                  ? '∞'
                  : `${formatValue(`${Math.abs(m_one.percentage || 0)}`, { type: 'number', dps })}%`}
              </span>
              {showPrevPeriodLabel && prevTimeFilter?.relativeTimeString && (
                <span style={{ color: `${LIGHTEST_FONT}` }}>&nbsp;vs {prevTimeFilter.relativeTimeString}</span>
              )}
            </div>
          )}
        </div>
        {/* Metric Two */}
        <div className="flex flex-col items-center mb-4">
          <div style={{ fontSize: `${metaFontSize}px`, marginBottom: '8px' }}>
            <p>{`${twoTitle || ''}`}</p>
          </div>
          <div style={{ fontSize: `${fontSize}px` }}>
            <p>
              {`${prefix_two || ''}${m_two.value || 0}`}
              <span style={{ fontSize: `${metaFontSize}px` }}>{`${suffix_two || ''}`}</span>
            </p>
          </div>
          {prevTimeFilter?.to && (
            <div
              className="font-normal text-center"
              style={{
                color: m_two.percentage && m_two.percentage < 0 ? '#FF6B6C' : '#3BA99C',
                fontSize: `${metaFontSize}px`,
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <Chevron
                className={`${m_two.percentage && m_two.percentage < 0 ? 'rotate-180' : ''} h-[20px] w-[9px] min-w-[9px] mr-1.5`}
              />
              <span>
                {m_two.percentage === Infinity
                  ? '∞'
                  : `${formatValue(`${Math.abs(m_two.percentage || 0)}`, { type: 'number', dps })}%`}
              </span>
              {showPrevPeriodLabel && prevTimeFilter?.relativeTimeString && (
                <span style={{ color: `${LIGHTEST_FONT}` }}>&nbsp;vs {prevTimeFilter.relativeTimeString}</span>
              )}
            </div>
          )}
        </div>
        {/* Metric Three */}
        <div className="flex flex-col items-center">
          <div style={{ fontSize: `${metaFontSize}px`, marginBottom: '8px' }}>
            <p>{`${threeTitle || ''}`}</p>
          </div>
          <div style={{ fontSize: `${fontSize}px` }}>
            <p>
              {`${prefix_three || ''}${m_three.value || 0}`}
              <span style={{ fontSize: `${metaFontSize}px` }}>{`${suffix_three || ''}`}</span>
            </p>
          </div>
          {prevTimeFilter?.to && (
            <div
              className="font-normal text-center"
              style={{
                color: m_three.percentage && m_three.percentage < 0 ? '#FF6B6C' : '#3BA99C',
                fontSize: `${metaFontSize}px`,
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <Chevron
                className={`${m_three.percentage && m_three.percentage < 0 ? 'rotate-180' : ''} h-[20px] w-[9px] min-w-[9px] mr-1.5`}
              />
              <span>
                {m_three.percentage === Infinity
                  ? '∞'
                  : `${formatValue(`${Math.abs(m_three.percentage || 0)}`, { type: 'number', dps })}%`}
              </span>
              {showPrevPeriodLabel && prevTimeFilter?.relativeTimeString && (
                <span style={{ color: `${LIGHTEST_FONT}` }}>&nbsp;vs {prevTimeFilter.relativeTimeString}</span>
              )}
            </div>
          )}
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