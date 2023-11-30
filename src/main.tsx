import React from 'react';
import ReactDOM from 'react-dom/client';

import './components/index.css';
import Dropdown from './components/Dropdown/Dropdown';
import LineChart from './components/LineChart/LineChart';
import DonutChart from './components/DonutChart/DonutChart';
import ColumnChart from './components/ColumnChart/ColumnChart';
import SingleValue from './components/SingleValue/SingleValue';
import Table from './components/Table/Table';
import TextInput from './components/TextInput/TextInput';
import NumberInput from './components/NumberInput/NumberInput';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="p-8">
      <Table
        columns={[
          {
            name: 'customers.country',
            title: 'Country',
            description: null
          },
          {
            name: 'products.size',
            title: 'Size',
            description: null
          },
          {
            name: 'products.name',
            title: 'Name',
            description: null
          }
        ]}
        maxPageRows={5}
        defaultSort={[
          {
            property: {
              name: 'customers.country',
              title: 'Country',
              __type__: 'dimension',
              nativeType: 'string'
            },
            direction: 'asc'
          },
          {
            property: {
              name: 'products.size',
              title: 'Size',
              __type__: 'dimension',
              nativeType: 'string'
            },
            direction: 'asc'
          },
          {
            property: {
              name: 'products.name',
              title: 'Name',
              __type__: 'dimension',
              nativeType: 'string'
            },
            direction: 'asc'
          }
        ]}
        tableData={{
          isLoading: false,
          data: [
            {
              'customers.country': 'Australia',
              'products.size': 'Big',
              'products.name': 'Ultimate Relaxer'
            },
            {
              'customers.country': 'Australia',
              'products.size': 'Giant',
              'products.name': 'Camo Beanbag Surprise'
            },
            {
              'customers.country': 'Australia',
              'products.size': 'Giant',
              'products.name': 'Suede Tanker'
            },
            {
              'customers.country': 'Australia',
              'products.size': 'Great Big',
              'products.name': 'Cozy Cresh'
            },
            {
              'customers.country': 'Australia',
              'products.size': 'Great Big',
              'products.name': 'Memory Bag with Leather Finish'
            }
          ]
        }}
      />
      <br />
      <div className="h-[500px]">
        <DonutChart
          showLabels
          showLegend
          maxGroups={4}
          count={{
            name: 'courses_in_progress.count',
            title: 'Count',
            description: null
          }}
          title="Courses In Progress"
          groups={{
            name: 'courses_in_progress.full_name',
            title: 'Full Name',
            description: null
          }}
          donut={{
            isLoading: false,
            data: [
              {
                'courses_in_progress.full_name': 'SPHERE F BLOCK',
                'courses_in_progress.count': 38
              },
              {
                'courses_in_progress.full_name': 'Research Skills',
                'courses_in_progress.count': 37
              },
              {
                'courses_in_progress.full_name': 'Journal Test',
                'courses_in_progress.count': 37
              },
              {
                'courses_in_progress.full_name': 'Applying for University',
                'courses_in_progress.count': 36
              },
              {
                'courses_in_progress.full_name': 'Creative Problem Solving',
                'courses_in_progress.count': 36
              },
              {
                'courses_in_progress.full_name': 'Critical Thinking',
                'courses_in_progress.count': 36
              },
              {
                'courses_in_progress.full_name': 'CV Writing',
                'courses_in_progress.count': 36
              },
              {
                'courses_in_progress.full_name': 'Entrepreneurship',
                'courses_in_progress.count': 36
              },
              {
                'courses_in_progress.full_name': 'Job Interview Skills',
                'courses_in_progress.count': 36
              },
              {
                'courses_in_progress.full_name': 'Making an Impact',
                'courses_in_progress.count': 36
              },
              {
                'courses_in_progress.full_name': 'Personal Statement Writing',
                'courses_in_progress.count': 36
              },
              {
                'courses_in_progress.full_name': 'Preparing for LNAT',
                'courses_in_progress.count': 36
              },
              {
                'courses_in_progress.full_name': 'Preparing for TSA',
                'courses_in_progress.count': 36
              },
              {
                'courses_in_progress.full_name': 'Public Speaking',
                'courses_in_progress.count': 36
              },
              {
                'courses_in_progress.full_name': 'University Interview Skills',
                'courses_in_progress.count': 36
              },
              {
                'courses_in_progress.full_name': 'Verbal Communication',
                'courses_in_progress.count': 36
              },
              {
                'courses_in_progress.full_name': 'Writing Skills',
                'courses_in_progress.count': 36
              },
              {
                'courses_in_progress.full_name': 'Resilience',
                'courses_in_progress.count': 36
              },
              {
                'courses_in_progress.full_name': 'Preparing for BMAT',
                'courses_in_progress.count': 36
              },
              {
                'courses_in_progress.full_name': 'SPHERE C Block',
                'courses_in_progress.count': 18
              },
              {
                'courses_in_progress.full_name': 'Questionnaire Journal',
                'courses_in_progress.count': 5
              },
              {
                'courses_in_progress.full_name': 'Study Skills',
                'courses_in_progress.count': 2
              },
              {
                'courses_in_progress.full_name': 'SPHERE EtonX Platform Training',
                'courses_in_progress.count': 1
              }
            ]
          }}
        />
      </div>
      <br />
      <div className="h-[400px]">
        <ColumnChart
          title="Test"
          showLabels
          showLegend
          count={{
            name: 'products.count',
            title: 'Count',
            description: null
          }}
          groupingB={{
            name: 'products.size',
            title: 'Size',
            description: null
          }}
          groupingA={{
            name: 'customers.country',
            title: 'Country',
            description: null
          }}
          columns={{
            isLoading: false,
            data: [
              {
                'customers.country': 'United States',
                'products.size': 'Giant',
                'products.count': '6'
              },
              {
                'customers.country': 'Germany',
                'products.size': 'Giant',
                'products.count': '5'
              },
              {
                'customers.country': 'United Kingdom',
                'products.size': 'Giant',
                'products.count': '5'
              },
              {
                'customers.country': 'United States',
                'products.size': 'Huge',
                'products.count': '3'
              },
              {
                'customers.country': 'United States',
                'products.size': 'Massive',
                'products.count': '3'
              },
              {
                'customers.country': 'New Zealand',
                'products.size': 'Big',
                'products.count': '3'
              },
              {
                'customers.country': 'United Kingdom',
                'products.size': 'Great Big',
                'products.count': '3'
              },
              {
                'customers.country': 'Germany',
                'products.size': 'Big',
                'products.count': '3'
              },
              {
                'customers.country': 'Germany',
                'products.size': 'Massive',
                'products.count': '3'
              },
              {
                'customers.country': 'Germany',
                'products.size': 'Huge',
                'products.count': '3'
              },
              {
                'customers.country': 'United States',
                'products.size': 'Big',
                'products.count': '3'
              },
              {
                'customers.country': 'United States',
                'products.size': 'Great Big',
                'products.count': '3'
              },
              {
                'customers.country': 'Belgium',
                'products.size': 'Massive',
                'products.count': '2'
              },
              {
                'customers.country': 'New Zealand',
                'products.size': 'Huge',
                'products.count': '2'
              },
              {
                'customers.country': 'New Zealand',
                'products.size': 'Massive',
                'products.count': '2'
              },
              {
                'customers.country': 'United Kingdom',
                'products.size': 'Big',
                'products.count': '2'
              },
              {
                'customers.country': 'New Zealand',
                'products.size': 'Super Giant',
                'products.count': '2'
              },
              {
                'customers.country': 'United Kingdom',
                'products.size': 'Huge',
                'products.count': '2'
              },
              {
                'customers.country': 'United Kingdom',
                'products.size': 'Massive',
                'products.count': '2'
              },
              {
                'customers.country': 'Belgium',
                'products.size': 'Super Giant',
                'products.count': '2'
              },
              {
                'customers.country': 'United States',
                'products.size': 'Super Giant',
                'products.count': '2'
              },
              {
                'customers.country': 'Germany',
                'products.size': 'Great Big',
                'products.count': '2'
              },
              {
                'customers.country': 'Belgium',
                'products.size': 'Big',
                'products.count': '2'
              },
              {
                'customers.country': 'Iceland',
                'products.size': 'Giant',
                'products.count': '2'
              },
              {
                'customers.country': 'Australia',
                'products.size': 'Great Big',
                'products.count': '2'
              },
              {
                'customers.country': 'Belgium',
                'products.size': 'Great Big',
                'products.count': '2'
              },
              {
                'customers.country': 'Australia',
                'products.size': 'Giant',
                'products.count': '2'
              },
              {
                'customers.country': 'New Zealand',
                'products.size': 'Giant',
                'products.count': '2'
              },
              {
                'customers.country': 'Iceland',
                'products.size': 'Huge',
                'products.count': '1'
              },
              {
                'customers.country': 'Australia',
                'products.size': 'Huge',
                'products.count': '1'
              },
              {
                'customers.country': 'Australia',
                'products.size': 'Massive',
                'products.count': '1'
              },
              {
                'customers.country': 'Australia',
                'products.size': 'Super Giant',
                'products.count': '1'
              },
              {
                'customers.country': 'Belgium',
                'products.size': 'Giant',
                'products.count': '1'
              },
              {
                'customers.country': 'Belgium',
                'products.size': 'Huge',
                'products.count': '1'
              },
              {
                'customers.country': 'Germany',
                'products.size': 'Super Giant',
                'products.count': '1'
              },
              {
                'customers.country': 'Iceland',
                'products.size': 'Great Big',
                'products.count': '1'
              },
              {
                'customers.country': 'Australia',
                'products.size': 'Big',
                'products.count': '1'
              },
              {
                'customers.country': 'Iceland',
                'products.size': 'Massive',
                'products.count': '1'
              },
              {
                'customers.country': 'New Zealand',
                'products.size': 'Great Big',
                'products.count': '1'
              },
              {
                'customers.country': 'United Kingdom',
                'products.size': 'Super Giant',
                'products.count': '1'
              }
            ]
          }}
        />
      </div>
      {/* <br />
      <div className="h-96">
        <LineChart
          title=""
          columns={{ isLoading: false, data: [] }}
          count={{ name: '', title: '', description: '' }}
          groupingA={{ name: '', title: '', description: '' }}
          groupingB={{ name: '', title: '', description: '' }}
          // showLabels
          showLegend
        />
      </div>
      <br />
      <SingleValue
        title=""
        value={{ isLoading: false, data: [] }}
        property={{ name: '', title: '', description: '' }}
      />
      <br />
      <Dropdown onChange={() => {}} value="Chocolate" />
      <br />
      <TextInput onChange={() => {}} value="Chocolate" />
      <br />
      <NumberInput onChange={() => {}} value="123" />
      <br /> */}
    </div>
  </React.StrictMode>
);
