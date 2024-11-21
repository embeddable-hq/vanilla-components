// React & 3rd Party
import React, { useEffect, useRef, useState } from 'react';
import { Dataset } from '@embeddable.com/core';
import Leaflet, { Marker, MarkerCluster } from 'leaflet';
import BasicCircle from '../../../icons/BasicCircle';
// import { MapContainer, Marker, TileLayer } from 'react-leaflet';
// import MarkerClusterGroup from 'react-leaflet-markercluster';

// Style
import 'leaflet/dist/leaflet.css';

// Local
import Container from '../../Container';
import geography from './geography.json';
import markers from './markers.json';

type Props = {
  ds?: Dataset;
  enableDownloadAsCSV?: boolean;
  enableDownloadAsPNG?: boolean;
};

const markerColor = '#8593e5';
const mapStyle = { height: '100%', minHeight: '100px' };

export default (props: Props) => {
  const markers: any[] = [];
  for (let i = 0; i < 10000; i++) {
    markers.push({
      position: {
        lng: -122.673447 + Math.random() * 200.0,
        lat: 45.5225581 - 60 + Math.random() * 80,
      },
    });
  }

  const [mapComponents, setMapComponents] = useState<{
    Circle: React.ComponentType<any>;
    MapContainer: React.ComponentType<any>;
    Marker: React.ComponentType<any>;
    MarkerClusterGroup: React.ComponentType<any>;
    TileLayer: React.ComponentType<any>;
  } | null>(null);
  const box = useRef<HTMLDivElement | null>(null);
  const tooltip = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Dynamically import 'react-simple-maps' components
    const loadMapComponents = async () => {
      const { Circle, MapContainer, Marker, TileLayer } = await import('react-leaflet');
      const mc = await import('react-leaflet-markercluster');

      setMapComponents({ Circle, MapContainer, Marker, TileLayer, MarkerClusterGroup: mc.default });
    };
    loadMapComponents();
  }, []);

  if (!mapComponents) return <div>Loading map...</div>;

  const createClusterCustomIcon = function (cluster: MarkerCluster) {
    const bubbleSize =
      cluster.getChildCount() < 10
        ? 18
        : Math.ceil(18 * (cluster.getChildCount().toString().length * 0.66));
    const bubbleRadius = Math.floor(bubbleSize / 2);
    return Leaflet.divIcon({
      html: `<span style="display: flex; width: ${bubbleSize}px; height: ${bubbleSize}px; background-color:${markerColor}; border-radius: ${bubbleRadius}px; color: #ffffff; align-items: center; justify-content: center;">${cluster.getChildCount()}</span>`,
      className: 'custom-marker-cluster',
      iconSize: Leaflet.point(33, 33, true),
    });
  };

  const createCustomIcon = function () {
    return Leaflet.divIcon({
      html: `<span style="display: flex; width: 10px; height: 10px; background-color:${markerColor}; border-radius: 5px; color: #ffffff; align-items: center; justify-content: center;">&nbsp;</span>`,
      className: 'custom-marker',
      iconSize: Leaflet.point(10, 10, true),
    });
  };

  const { Circle, MapContainer, Marker, TileLayer, MarkerClusterGroup } = mapComponents;

  return (
    <Container {...props} className="overflow-y-hidden">
      <div style={mapStyle}>
        <MapContainer center={[51.509865, -0.118092]} zoom={4} style={mapStyle} maxZoom={16}>
          <TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" attribution="" />
          <MarkerClusterGroup
            onClick={(e: any) => console.log('onClick', e)}
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={100}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
          >
            {markers.map((address, index) => {
              const lat = address.position.lat;
              const lng = address.position.lng;
              return (
                <Marker
                  icon={createCustomIcon()}
                  key={`${lat}-${index}-${lng}`}
                  position={[lat, lng]}
                  title=""
                ></Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </Container>
  );
};
