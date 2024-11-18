import { CategoryScale, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js';
import * as ChartGeo from 'chartjs-chart-geo';
import { useEffect, useRef, useState } from 'react';
import { Chart } from 'react-chartjs-2';

import Container from '../../Container';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  ChartGeo.ChoroplethController,
  ChartGeo.ProjectionScale,
  ChartGeo.ColorScale,
  ChartGeo.GeoFeature,
);

export default function Map(props: any) {
  const chartRef = useRef();
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mapComponents, setMapComponents] = useState<any>(null);

  // Dynamically import 'chartjs-chart-geo' components
  useEffect(() => {
    const loadMapComponents = async () => {
      const ChartGeo = await import('chartjs-chart-geo');
      setMapComponents({ ChartGeo });
    };
    loadMapComponents();
  }, []);

  // Load the map data only after the 'chartjs-chart-geo' components are loaded
  useEffect(() => {
    if (!mapComponents) {
      return;
    }
    const { ChartGeo } = mapComponents;
    const getData = async () => {
      const response = await fetch(
        'https://raw.githubusercontent.com/markmarkoh/datamaps/master/src/js/data/bra.topo.json',
      );
      console.log(response);
      const value = await response.json();
      console.log(value);
      console.log(ChartGeo.topojson.feature(value, value.objects.bra));
      setData((ChartGeo.topojson.feature(value, value.objects.bra) as any).features);
      setIsLoading(false);
    };
    getData();
  }, [mapComponents]);

  if (isLoading || data.length < 1) {
    return <Container {...props}>... Loading</Container>;
  }

  return (
    <Container {...props} className="overflow-y-hidden">
      <Chart
        ref={chartRef}
        type="choropleth"
        data={{
          labels: data.map((d: any) => d.properties.name),
          datasets: [
            {
              outline: data,
              label: 'Dataset 1',
              data: data.map((d: any) => ({
                feature: d,
                value: Math.random() * 10,
              })),
            },
          ],
        }}
        options={{
          showOutline: true,
          showGraticule: true,
          plugins: {
            legend: {
              display: true,
            },
          },
          hover: {
            mode: 'nearest',
          },
          scales: {
            xy: {
              projection: 'mercator',
            },
          },
        }}
      />
    </Container>
  );
}
