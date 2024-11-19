// React & 3rd Party
import React, { useEffect, useRef, useState } from 'react';
import { Dataset } from '@embeddable.com/core';
import Leaflet from 'leaflet';
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

const defaultColor = '#EBEBEB';
const hoverColor = '#0957cb';
const markerColor = '#8593e5';
const position = [51.505, -0.09];
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
      const { MapContainer, Marker, TileLayer } = await import('react-leaflet');
      const mc = await import('react-leaflet-markercluster');

      setMapComponents({ MapContainer, Marker, TileLayer, MarkerClusterGroup: mc.default });
    };
    loadMapComponents();
  }, []);

  if (!mapComponents) return <div>Loading map...</div>;

  const { MapContainer, Marker, TileLayer, MarkerClusterGroup } = mapComponents;

  return (
    <div style={mapStyle}>
      <MapContainer center={[51.509865, -0.118092]} zoom={4} style={mapStyle} maxZoom={16}>
        <TileLayer
          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup
          onClick={(e: any) => console.log('onClick', e)}
          maxClusterRadius={150}
          spiderfyOnMaxZoom={true}
          polygonOptions={{
            fillColor: '#ffffff',
            color: '#f00800',
            weight: 5,
            opacity: 1,
            fillOpacity: 0.8,
          }}
          showCoverageOnHover={true}
        >
          {markers.map((address, index) => {
            const lat = address.position.lat;
            const lng = address.position.lng;
            return <Marker key={`${lat}-${index}-${lng}`} position={[lat, lng]} title=""></Marker>;
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};
