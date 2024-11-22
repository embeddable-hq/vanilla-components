// React & 3rd Party
import React, { useEffect, useState } from 'react';
import { DataResponse, Dataset, DimensionOrMeasure, Measure } from '@embeddable.com/core';
import Leaflet, { LatLngBoundsExpression, MarkerCluster } from 'leaflet';
import { MapContainerProps, MarkerProps, TileLayerProps, Tooltip, useMap } from 'react-leaflet';
import cities from './cities.json';

// Style
import 'leaflet/dist/leaflet.css';

// Local
import Container from '../../Container';

// Constants
const mapStyle = { height: '100%', minHeight: '100px' };
const bounds: LatLngBoundsExpression = [
  [0, 0],
  [0, 0],
]; // this gets overwritten by SetBounds

type BoundsProps = {
  markers: MarkerData[];
};

type MarkerData = {
  lat: number;
  lng: number;
  name: string;
};

type Props = {
  bubblePlacement?: DimensionOrMeasure;
  clusterRadius?: number;
  customTileSet?: string;
  ds?: Dataset;
  enableDownloadAsCSV?: boolean;
  enableDownloadAsPNG?: boolean;
  markerClusterColor?: string;
  markerColor?: string;
  metric?: DimensionOrMeasure;
  results: DataResponse;
  showTooltips?: boolean;
  toolTipValues?: Measure;
};

// Child Component - used to auto-zoom the map to fit all markers (rerenders if they change)
const SetBounds = (props: BoundsProps) => {
  const { markers } = props;
  const map = useMap();

  const bounds = markers.reduce(
    (acc: any, marker: MarkerData) => {
      const { lat, lng } = marker;
      return [
        [Math.min(acc[0][0], lat), Math.min(acc[0][1], lng)],
        [Math.max(acc[1][0], lat), Math.max(acc[1][1], lng)],
      ] as LatLngBoundsExpression;
    },
    [
      [Infinity, Infinity],
      [-Infinity, -Infinity],
    ],
  );
  map.fitBounds(bounds);

  return null;
};

// Main Component
export default (props: Props) => {
  const {
    clusterRadius,
    customTileSet,
    ds,
    markerClusterColor,
    markerColor,
    metric,
    results,
    toolTipValues,
  } = props;
  console.log(results);
  console.log(toolTipValues);

  // TEMP - generate random markers
  const markers: MarkerData[] = [];
  cities.forEach((city: any) => {
    markers.push({ lat: city.lat, lng: city.lng, name: city.city });
  });

  // TEMP - randomly assign a tooltip value to the markers
  const updatedMarkers = markers.map((marker) => {
    const randomIndex = Math.floor(Math.random() * (results?.data?.length || 1));
    marker.name = results?.data?.[randomIndex][toolTipValues?.name || ''] || 'unknown';
    return marker;
  });

  // Handle values for post-facto imported components
  const [mapComponents, setMapComponents] = useState<{
    MapContainer: React.ComponentType<MapContainerProps>;
    Marker: React.ComponentType<MarkerProps>;
    MarkerClusterGroup: React.ComponentType<any>; // MarkerClusterGroupProps not exposed
    TileLayer: React.ComponentType<TileLayerProps>;
  } | null>(null);

  // Get around "can't use require" issues by post-facto importing components
  useEffect(() => {
    const loadMapComponents = async () => {
      const { MapContainer, Marker, TileLayer } = await import('react-leaflet');
      const mc = await import('react-leaflet-markercluster');

      setMapComponents({ MapContainer, Marker, TileLayer, MarkerClusterGroup: mc.default });
    };
    loadMapComponents();
  }, []);

  // Don't bother rendering if we don't have the components
  if (!mapComponents) return <div>Loading map...</div>;

  // Custom Cluster Icon (Bubble)
  const createClusterCustomIcon = function (cluster: MarkerCluster) {
    const bubbleSize =
      cluster.getChildCount() < 10
        ? 18
        : Math.ceil(18 * (cluster.getChildCount().toString().length * 0.66));
    const bubbleRadius = Math.floor(bubbleSize / 2);
    return Leaflet.divIcon({
      html: `<span style="display: flex; width: ${bubbleSize}px; height: ${bubbleSize}px; background-color:${markerClusterColor}; border-radius: ${bubbleRadius}px; color: #ffffff; align-items: center; justify-content: center;">${cluster.getChildCount()}</span>`,
      className: 'custom-marker-cluster',
      iconSize: Leaflet.point(33, 33, true),
    });
  };

  // Custom Marker Icon (Small Bubble)
  const createCustomIcon = function () {
    return Leaflet.divIcon({
      html: `<span style="display: flex; width: 10px; height: 10px; background-color:${markerColor}; border-radius: 5px; color: #ffffff; align-items: center; justify-content: center;">&nbsp;</span>`,
      className: 'custom-marker',
      iconSize: Leaflet.point(10, 10, true),
    });
  };

  const { MapContainer, Marker, TileLayer, MarkerClusterGroup } = mapComponents;

  return (
    <Container {...props} className="overflow-y-hidden">
      <div style={mapStyle}>
        <MapContainer
          attributionControl={false}
          bounds={bounds}
          maxZoom={16}
          style={mapStyle}
          zoom={4}
        >
          <TileLayer
            url={customTileSet ? customTileSet : 'https://{s}.tile.osm.org/{z}/{x}/{y}.png'}
            attribution=""
          />
          <SetBounds markers={updatedMarkers} />
          <MarkerClusterGroup
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={clusterRadius}
            onClick={(e: any) => console.log('onClick', e)}
            removeOutsideVisibleBounds
            showCoverageOnHover={false}
            spiderfyOnMaxZoom={true}
          >
            {updatedMarkers.map((address, index) => {
              const lat = address.lat;
              const lng = address.lng;
              return (
                <Marker
                  icon={createCustomIcon()}
                  key={`${lat}-${index}-${lng}`}
                  position={[lat, lng]}
                  title=""
                >
                  <Tooltip>{address.name}</Tooltip>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </Container>
  );
};
