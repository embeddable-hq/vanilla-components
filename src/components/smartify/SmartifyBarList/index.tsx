import { Dataset, Dimension, Measure, loadData } from '@embeddable.com/core';
import { DataResponse } from '@embeddable.com/react';
import { BarList, Bold, Card, Flex, Text, Title } from '@tremor/react';
import React, { useMemo, useRef } from 'react';

import useFont from '../../hooks/useFont';
import useResize from '../../hooks/useResize';
import { Inputs } from './SmartifyBarList.emb';

type Props = Inputs & {
  title?: string;
  columns: DataResponse;
  metric: Measure;
  dimension: Dimension;
  dimensionHeader?: string;
  metricHeader?: string;
  colorDeco: string;
  ds: Dataset;
};

const cat_1 = [
  {
    name: '1913717213',
    value: 72815
  },
  {
    name: '1047860117',
    value: 13532
  },
  {
    name: '1047860114',
    value: 8350
  }
];

const categories = [
  {
    title: 'Top Languages by User', //1. Title
    headerDim: 'Language', //5. Dimension Header
    headerMetric: 'Users', //4. Metric Header
    decoration: 'top', //7. Has Accent
    decorationColor: 'yellow', //7.a Accent Collor
    barColor: 'yellow', //6. Bar Color
    data: [
      //2. & 3. Metric & Dimension
      {
        name: 'en-GB',
        value: 456
      },
      {
        name: 'de-DE',
        value: 351
      },
      {
        name: 'fr-FR',
        value: 271
      },
      {
        name: 'it-IT',
        value: 191
      },
      {
        name: 'es-ES',
        value: 91
      }
    ]
  }
];

function transformObject(arr) {
  return arr.map((item) => ({
    name: item['testing_venue_overall.stream'],
    value: item['testing_venue_overall.users']
  }));
}

export default (props: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, height] = useResize(ref);

  useFont();

  console.log(props);

  /*const { ds, dimension, metric, columns } = useMemo(() => {
    type Memo = {
      ds: Dataset;
      dimension: Dimension;
      metric: Measure;
      columns: DataResponse;
    };

    return { ds, dimension, metric };
  }, [props]);*/

  const validatedData = props.columns.data.map((item) => ({
    name: item['testing_venue_overall.stream'],
    value: item['testing_venue_overall.users']
  }));

  console.log(props);

  /*const transformedData = transformObject(props?.columns.data);
  console.log(transformedData);*/

  return (
    <div style={{ boxShadow: '0 1px 4px #1c1c2133', borderRadius: '5px' }}>
      <Card decoration="top" decorationColor={props.colorDeco}>
        <Title>{props.title}</Title>
        <Flex>
          <Text>
            <Bold>{props.dimensionHeader}</Bold>
          </Text>
          <Text>
            <Bold>{props.metricHeader}</Bold>
          </Text>
        </Flex>
        {/*<BarList data={props.columns.data} color={props.colorDeco}></BarList>*/}
        <BarList data={cat_1} color={props.colorDeco}></BarList>
      </Card>
    </div>
  );
};
