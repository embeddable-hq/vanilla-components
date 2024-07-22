import { useEmbeddableState } from '@embeddable.com/react';
import React, { useState, useEffect, useRef } from 'react';
import Container from '../../Container';
import Dropdown from '../../controls/Dropdown';
import BarChart from '../BarChart/components/BarChart';

export default (props: Props) => {
  const { results, title } = props;

  const [value, setValue] = useState(props.xAxis?.title);
  const [_, setDimension] = useEmbeddableState({ dimension: null });

  const xAxisOptions = props.xAxisOptions.find((item) => props.xAxis.title == item.title) 
    ? props.xAxisOptions 
    : [...props.xAxisOptions, props.xAxis ]

  const handleChange = (newValue) => {
    setValue(newValue);
    const selectedDimension = xAxisOptions.find(item => newValue === item.title);
    setDimension({ dimension: selectedDimension });
  }

  const xAxis = xAxisOptions.find(item => value === item.title);

  const newProps = {...props, xAxis: xAxis };

  return (
    <Container
      {...props}
      className="overflow-y-hidden">
      <div className="flex h-[60px] w-full">
          <div>
            <select className="relative px-3 rounded-xl w-full min-w-[50px] h-10 border border-[#DADCE1] flex items-center" value={value} onChange={(e) => handleChange(e.target.value)} style={{ position: 'relative', height: '40px', width: 'auto'}}>
              {xAxisOptions.map((o, i) => <option key={i} value={o.title}>{o.title}</option>)}
            </select>
          </div>
        </div>
        <div className='flex grow overflow-hidden'>
          {results.isLoading || results.data[0][xAxis.name] == null
            ? null 
            : (
              <BarChart
                key={value}
                {...newProps}
              />
            )
          }         
        </div>
    </Container>
  );
};
