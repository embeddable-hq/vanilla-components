import { dateParser } from '@cubejs-backend/api-gateway/dist/src/dateParser.js';
import { DataResponse, Dimension, Granularity, TimeRange } from '@embeddable.com/core';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import DateRangePicker from './DateRangePicker';
import Dropdown from '../../Dropdown';
import { getValidGranularities, getNote, getComparisonOptions, getComparisonPeriod } from '../utils/dateUtils'

const valueProp: Dimension = {
  __type__: 'dimension',
  name: 'value',
  nativeType: 'string',
  title: 'Value'
};

export type Props = {
  defaultPeriod?: TimeRange;
  defaultComparison?: string;
  defaultGranularity?: Granularity;
  showGranularity?: boolean;
  onChangePeriod: (v: TimeRange | null) => void;
  onChangeComparison: (v: TimeRange | null) => void;
  onChangeGranularity: (v: Granularity | null) => void;
};

export default function DateRangeWithGranularity(props: Props) {
  const { onChangeComparison, onChangePeriod, defaultPeriod } = props;

  const ref = useRef<HTMLDivElement | null>(null);
  const [hideDate, setHideDate] = useState(false);
  const [period, setPeriod] = useState(defaultPeriod);
  const [granularity, setGranularity] = useState(props.defaultGranularity);
  const [compareOption, setCompareOption] = useState(props.defaultComparison);

  useLayoutEffect(() => {
    const interval = setInterval(() => {
      const width = ref.current?.clientWidth;

      if (width) setHideDate(width < 250);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const granularityOptions = getValidGranularities(period);

  const comparisonOptions: DataResponse = useMemo(() => {
    return {
      isLoading: false,
      data: getComparisonOptions(period)
    };
  }, [period?.from, period?.to]);

  const changeComparisonOption = useCallback(
    (value: string) => {      
      setCompareOption(value);
      if (!period?.from || !period?.to) return;
      if (value === 'No comparison') {
        onChangeComparison(null);
        return;
      }
      onChangeComparison({
        ...getComparisonPeriod(value, period)
      });
    },
    [onChangeComparison, period, setCompareOption]
  );

  useEffect(() => {
    if (compareOption) changeComparisonOption(compareOption);
  }, [compareOption, changeComparisonOption]);

  //ensure the default period is set correctly on first load
  useEffect(() => {
    if (!defaultPeriod) return;
    if (
      !defaultPeriod?.from &&
      !defaultPeriod?.to &&
      defaultPeriod?.relativeTimeString
    ) {
      const [from, to] = dateParser(defaultPeriod?.relativeTimeString, '');
      if (!from || !to) return;
      defaultPeriod.from = new Date(from);
      defaultPeriod.to = new Date(to);
      setPeriod(defaultPeriod);
      onChangePeriod(defaultPeriod as TimeRange);
      return;
    }
    setPeriod(defaultPeriod);
  }, [defaultPeriod, onChangePeriod]);


  return (    
      <div className="flex items-center h-10">
        <div ref={ref} className="grow basis-0 max-w-96 h-full">
          <DateRangePicker
            hideDate={hideDate}
            value={period}
            onChange={(period) => {
              setPeriod(period as TimeRange);

              props.onChangePeriod((period as TimeRange) || null);

              const g = getValidGranularities(period as TimeRange).recommended.value
              if (granularity === g) return;
              setGranularity(g);
              props.onChangeGranularity(g);
            }}
          />
        </div>
        {!!onChangeComparison && (
          <>
            <div className="hidden md:block shrink whitespace-nowrap text-[14px] font-normal text-[#101010] leading-none ml-2">
              compare to
            </div>
            <div className="grow basis-0 max-w-[150px] h-full ml-2">
              <Dropdown
                unclearable
                minDropdownWidth={320}
                defaultValue={compareOption}
                options={comparisonOptions}
                placeholder="Comparison"
                onChange={changeComparisonOption}
                property={valueProp}
              />
            </div>
          </>
        )}        
        {!!props.showGranularity && (
          <div className="grow basis-0 max-w-[115px] h-full ml-2">
            <Dropdown
              unclearable
              minDropdownWidth={80}
              defaultValue={granularity}
              options={granularityOptions}
              property={valueProp}
              placeholder="Granularity"
              onChange={(c) => {
                const value = c as Granularity;
                setGranularity(value);
                props.onChangeGranularity(value);
              }}
            />
          </div>
        )}
      </div>    
  );
}