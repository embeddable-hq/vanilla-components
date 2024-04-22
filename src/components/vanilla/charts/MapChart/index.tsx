import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { scaleLinear } from 'd3-scale';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ComposableMapProps, GeographiesProps, GeographyProps } from 'react-simple-maps';

import format from '../../../util/format';
import Container from '../../Container';
import geography from './geography.json';

type Props = {
  title?: string;
  db: DataResponse;
  segments?: Dimension;
  metric?: Measure;
};

type Record = { [p: string]: string };

const defaultColor = '#EBEBEB';
const lowColor = '#E7F0FE';
const highColor = '#146EF5';
const hoverColor = '#0957cb';

export default (props: Props) => {
  const [mapComponents, setMapComponents] = useState<{
    ComposableMap: React.ComponentType<ComposableMapProps>;
    Geographies: React.ComponentType<GeographiesProps>;
    Geography: React.ComponentType<GeographyProps>;
  } | null>(null);
  const box = useRef<HTMLDivElement | null>(null);
  const tooltip = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Dynamically import 'react-simple-maps' components
    const loadMapComponents = async () => {
      const { ComposableMap, Geographies, Geography } = await import('react-simple-maps');
      setMapComponents({ ComposableMap, Geographies, Geography });
    };
    loadMapComponents();
  }, []);

  const [data, maxMetric] = useMemo((): [{ [segment: string]: number }, number] => {
    let maxMetric = 0;

    const data =
      props.db.data?.reduce((memo: { [segment: string]: number }, record: Record) => {
        if (!props.segments || !props.metric) return memo;

        const segment: string = record[props.segments.name];

        const metric = record[props.metric.name] ? parseInt(record[props.metric.name], 10) : 0;

        maxMetric = Math.max(maxMetric, metric);

        memo[segment] = metric;

        return memo;
      }, {}) || {};

    return [data, maxMetric];
  }, [props]);

  const colorScale = useMemo(() => {
    return scaleLinear<string>().domain([0, maxMetric]).range([lowColor, highColor]);
  }, [maxMetric]);

  if (!mapComponents) return <div>Loading map...</div>;

  const { ComposableMap, Geographies, Geography } = mapComponents;

  return (
    <Container className="overflow-y-hidden" title={props.title} results={props.db}>
      <div className="relative aspect-[1.87] overflow-hidden cursor-pointer">
        <div
          ref={box}
          className="relative"
          onMouseMove={(e) => {
            const { left, top } = box.current!.getBoundingClientRect();

            tooltip.current!.style.left = `${e.clientX - left - 7}px`;
            tooltip.current!.style.top = `${e.clientY - top - 29}px`;
          }}
        >
          <div
            ref={tooltip}
            className="absolute text-black bg-slate-200/80 rounded-sm whitespace-nowrap pointer-events-none empty:opacity-0 opacity-100 px-2 py-1 text-xs"
          />
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              rotate: [-10, 0, 0],
              scale: 100
            }}
          >
            <Geographies geography={geography}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const value = data[geo.id] || data[geo?.properties?.name || ''];

                  return (
                    <Geography
                      onMouseEnter={() => {
                        tooltip.current!.innerHTML = `${geo.properties.name}: ${format(
                          `${value || 0}`,
                          { type: 'number', meta: props.metric?.meta }
                        )}`;
                      }}
                      onMouseLeave={() => {
                        tooltip.current!.innerHTML = '';
                      }}
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          outline: 'none'
                        },
                        hover: {
                          fill: hoverColor,
                          outline: 'none'
                        },
                        pressed: {
                          outline: 'none'
                        }
                      }}
                      fill={`${value ? colorScale(value) : defaultColor}`}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>
      </div>
    </Container>
  );
};