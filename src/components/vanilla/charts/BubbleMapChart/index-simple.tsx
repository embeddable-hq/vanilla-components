import { Dataset } from '@embeddable.com/core';
import React, { useEffect, useRef, useState } from 'react';
import {
  ComposableMapProps,
  GeographiesProps,
  GeographyProps,
  MarkerProps,
} from 'react-simple-maps';

import Container from '../../Container';
import geography from './geography.json';
import markers from './markers.json';

type Props = {
  ds?: Dataset;
  enableDownloadAsCSV?: boolean;
  enableDownloadAsPNG?: boolean;
};

const defaultColor = '#EBEBEB';
const hoverColor = '#0957cb';
const markerColor = '#8593e5';

// Temp data
type CityCoordinates = { coordinates: [number, number] }[];
const cityCoordinates: CityCoordinates = markers as CityCoordinates;

export default (props: Props) => {
  const [mapComponents, setMapComponents] = useState<{
    ComposableMap: React.ComponentType<ComposableMapProps>;
    Geographies: React.ComponentType<GeographiesProps>;
    Geography: React.ComponentType<GeographyProps>;
    Marker: React.ComponentType<MarkerProps>;
  } | null>(null);
  const box = useRef<HTMLDivElement | null>(null);
  const tooltip = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Dynamically import 'react-simple-maps' components
    const loadMapComponents = async () => {
      const { ComposableMap, Geographies, Geography, Marker } = await import('react-simple-maps');
      setMapComponents({ ComposableMap, Geographies, Geography, Marker });
    };
    loadMapComponents();
  }, []);

  if (!mapComponents) return <div>Loading map...</div>;

  const { ComposableMap, Geographies, Geography, Marker } = mapComponents;

  const mapScale = 100;

  return (
    <Container {...props} className="overflow-y-hidden">
      <div className="relative aspect-[1.87] overflow-hidden cursor-pointer">
        <div ref={box}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              rotate: [-10, 0, 0],
              scale: mapScale,
            }}
          >
            <Geographies geography={geography}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  return (
                    <Geography
                      onMouseLeave={() => {
                        tooltip.current!.innerHTML = '';
                      }}
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          outline: 'none',
                        },
                        hover: {
                          fill: hoverColor,
                          outline: 'none',
                        },
                        pressed: {
                          outline: 'none',
                        },
                      }}
                      fill={defaultColor}
                    />
                  );
                })
              }
            </Geographies>
            {cityCoordinates.map(({ coordinates }) => (
              <Marker key={`${coordinates[0] - coordinates[1]}`} coordinates={coordinates}>
                <circle r={Math.floor(mapScale / 30)} fill={markerColor} />
              </Marker>
            ))}
          </ComposableMap>
        </div>
      </div>
    </Container>
  );
};
