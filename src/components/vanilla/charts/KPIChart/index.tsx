import { DataResponse, Dimension, Measure, TimeRange } from '@embeddable.com/core';
import React, { useMemo } from 'react';

import formatValue from '../../../util/format';
import Container from '../../Container';
import { WarningIcon } from '../../icons';
import { Theme } from '../../../../themes/theme';
import { useTheme } from '@embeddable.com/react';

type Props = {
  results: DataResponse;
  prevResults?: DataResponse;
  prevTimeFilter?: TimeRange;
  title?: string;
  prefix?: string;
  suffix?: string;
  metric?: Measure;
  displayMetric?: boolean;
  dimension?: Dimension;
  dps?: number;
  fontSize?: number;
  showPrevPeriodLabel?: boolean;
};

export default (props: Props) => {
  const {
    results,
    prevResults,
    prevTimeFilter,
    metric,
    displayMetric,
    dimension,
    dps,
    prefix,
    suffix,
    showPrevPeriodLabel,
  } = props;

  const theme: Theme = useTheme() as Theme;

  const { n, percentage } = useMemo(() => {
    if (dimension || !metric?.name || !results?.data?.length) {
      return { percentage: null, n: null }; // Skip calculations
    }

    const n = parseFloat(results?.data?.[0]?.[metric.name] || 0);
    const prev = parseFloat(prevResults?.data?.[0]?.[metric.name] || 0);

    return {
      percentage: prev || prev === 0 ? Math.round((n / prev) * 100) - 100 : null,
      n: formatValue(n.toString(), {
        type: 'number',
        meta: metric?.meta,
        dps: dps,
      }),
    };
  }, [results, prevResults, metric, dps, dimension]);

  const fontSize = props.fontSize || theme.charts.kpi.font.size;
  const metaFontSize = Math.max(fontSize / 3, parseInt(theme.font.size.replace('px', ''), 10));
  const fontColor = theme.font.colorDark;
  const negativeColor = theme.charts.kpi.font.negativeColor;

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
      <div
        className={`
          flex
          flex-col
          font-embeddable
          h-full
          items-${theme.charts.kpi?.alignment || 'center'}
          justify-center
          leading-tight
          relative
          text-${theme.charts.kpi?.alignment || 'center'}
          font-[--embeddable-charts-fontWeights-kpiNumber]
        `}
      >
        {dimension ? (
          <>
            <div
              className={`text-[color:--embeddable-font-colorDark]`}
              style={{ fontSize: `${fontSize}px` }}
            >
              <p>{results?.data?.[0]?.[dimension.name]}</p>
            </div>
            {displayMetric && metric && (
              <p
                className={`font-normal`}
                style={{
                  fontSize: `${metaFontSize}px`,
                  color: fontColor,
                }}
              >
                {`${metric.title}: ${formatValue(`${results?.data?.[0]?.[metric.name]}`, {
                  type: 'number',
                  dps: dps,
                  meta: metric?.meta,
                })}
                `}
              </p>
            )}
          </>
        ) : (
          <>
            <div
              className={`text-[color:--embeddable-font-colorDark]`}
              style={{ fontSize: `${fontSize}px` }}
            >
              <p>{`${prefix || ''}${n || 0}${suffix || ''}`}</p>
            </div>
            {prevTimeFilter?.to && (
              <div
                className={`
                  flex
                  flex-wrap
                  font-normal
                  items-${theme.charts.kpi?.alignment || 'center'}
                  justify-center
                  text-${theme.charts.kpi?.alignment || 'center'}
                `}
                style={{
                  color: percentage && percentage < 0 ? negativeColor : fontColor,
                  fontSize: `${metaFontSize}px`,
                }}
              >
                <Chevron
                  className={`${percentage && percentage < 0 ? 'rotate-180' : ''} h-[20px] w-[9px] min-w-[9px] mr-1.5`}
                />
                <span>
                  {percentage === Infinity
                    ? '∞'
                    : `${formatValue(`${Math.abs(percentage || 0)}`, { type: 'number', dps: dps })}%`}
                </span>
                {showPrevPeriodLabel &&
                  prevTimeFilter?.relativeTimeString &&
                  prevTimeFilter.relativeTimeString.length > 0 && (
                    <span style={{ color: fontColor }}>
                      &nbsp;
                      {`vs ${prevTimeFilter.relativeTimeString}`}
                    </span>
                  )}
              </div>
            )}
          </>
        )}
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
