import { DataResponse, Dimension, Granularity, Measure } from '@embeddable.com/core';
import { useEmbeddableState, useOverrideConfig } from '@embeddable.com/react';
import React, { useEffect, useState } from 'react';

import Container from '../../Container';
import BarChart from '../BarChart/components/BarChart';
import defaultTheme from '../../../../themes/defaulttheme';
import { Theme } from '../../../../themes/theme';

export type Props = {
  description?: string;
  displayHorizontally?: boolean;
  dps?: number;
  enableDownloadAsCSV?: boolean;
  granularity?: Granularity;
  metrics: Measure[];
  results: DataResponse;
  reverseXAxis?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  title?: string;
  xAxis: Dimension;
  xAxisOptions?: Dimension[];
  theme?: Theme;
};

export default (props: Props) => {
  const { results } = props;

  const [value, setValue] = useState(props.xAxis.name);
  const [_, setDimension] = useEmbeddableState({ dimension: null }) as [
    { dimension: Dimension | null },
    (d: { dimension: Dimension | null }) => void,
  ];

  // Get theme for use in component
  const overrides: any = useOverrideConfig();
  let { theme } = overrides;
  if (!theme) {
    theme = defaultTheme;
  }

  useEffect(() => {
    setValue(props.xAxis.name);
  }, [props.xAxis]);

  const xAxisOptions = props.xAxisOptions?.find((item) => props.xAxis.name == item.name)
    ? props.xAxisOptions
    : [...(props.xAxisOptions || []), props.xAxis];

  const handleChange = (newValue: string) => {
    setValue(newValue);
    const selectedDimension = xAxisOptions.find((item) => newValue === item.name) || null;
    setDimension({ dimension: selectedDimension });
  };

  const xAxis = xAxisOptions.find((item) => value === item.name);
  const updatedProps = {
    ...props,
    theme,
    xAxis: xAxis ? xAxis : props.xAxis,
  };

  return (
    <Container {...props} className="overflow-y-hidden">
      <div className="flex h-[60px] w-full">
        <div>
          <select
            className="relative px-3 rounded-xl w-full min-w-[50px] h-10 border border-[#DADCE1] flex items-center"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
          >
            {xAxisOptions?.map((o, i) => (
              <option key={i} value={o.name}>
                {o.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex grow overflow-hidden">
        {results.isLoading || !xAxis || results?.data?.[0]?.[xAxis.name] == null ? null : (
          <BarChart key={value} {...updatedProps} />
        )}
      </div>
    </Container>
  );
};
