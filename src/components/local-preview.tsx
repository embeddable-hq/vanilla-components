import React from 'react';
import ReactDOM from 'react-dom/client';

import './vanilla/index.css';
import Dropdown from './vanilla/controls/Dropdown';
import TextInput from './vanilla/controls/TextInput';
import DonutChart from './vanilla/charts/DonutChart';
import BarChart from './vanilla/charts/BarChart';
import KPIChart from './vanilla/charts/KPIChart';
import NumberInput from './vanilla/controls/NumberInput';
import LineChart from './vanilla/charts/LineChart';
import DateRangePicker from './vanilla/controls/DateRangePicker';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="p-8">
      <Dropdown
        title="test"
        onChange={() => { }}
        property={{
          name: 'customers.country',
          title: 'Country',
          description: null
        }}
        value=""
        options={{
          isLoading: false,
          data: [
            {
              'customers.country': 'Australia'
            },
            {
              'customers.country': 'Belgium'
            },
            {
              'customers.country': 'Germany'
            },
            {
              'customers.country': 'Iceland'
            },
            {
              'customers.country': 'New Zealand'
            },
            {
              'customers.country': 'United Kingdom'
            },
            {
              'customers.country': 'United States'
            }
          ]
        }}
      />
      <DateRangePicker onChange={() => { }} />
      <div className="h-[500px]">
        <DonutChart
          showLabels
          showLegend
          maxSegments={4}
          metric={{
            name: 'courses_in_progress.count',
            title: 'Count',
            description: null
          }}
          title="Courses In Progress"
          segments={{
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
        <BarChart
          title="Test"
          showLabels
          showLegend
          maxXaxisItems={5}
          maxLabels={5}
          xAxisTitle="Countries"
          yAxisTitle="Amount of products"
          metric={{
            name: 'products.count',
            title: 'Count',
            description: null
          }}
          xAxis={{
            name: 'products.size',
            title: 'Size',
            description: null
          }}
          xAxisLabel={{
            name: 'customers.country',
            title: 'Country',
            description: null
          }}
          columns={{
            isLoading: false,
            data: fakeColumnData()
          }}
        />
      </div>
      <br />

      <div className="h-[400px]">
        <LineChart
          metrics={[
            {
              name: 'products.count',
              title: 'Count',
              description: null
            }
          ]}
          xAxis={{
            name: 'transactions.created_at',
            title: 'Created at',
            description: 'The time when the transaction was created'
          }}
          showLabels={true}
          showLegend={true}
          granularity="week"
          xAxisTitle="Date"
          yAxisTitle="Product Count"
          line={{
            isLoading: false,
            data: fakeChartData()
          }}
        />
      </div>
      <br />
      <KPIChart
        title=""
        value={{ isLoading: false, data: [] }}
        metric={{ name: '', title: '', description: '' }}
      />
      <br />
      <Dropdown
        onChange={() => { }}
        property={{
          name: 'customers.email',
          title: 'Email',
          description: null
        }}
        title="test"
        value=""
        options={{
          isLoading: false,
          data: [
            {
              'customers.email': 'acouvert1y@csmoncomor.com'
            },
            {
              'customers.email': 'aeberdtq@lulu.com'
            },
            {
              'customers.email': 'alarchier32@theguardian.com'
            },
            {
              'customers.email': 'anisco3q@pen.io'
            },
            {
              'customers.email': 'avalentine2w@blogtalkradio.com'
            },
            {
              'customers.email': 'bbeaka@apache.org'
            },
            {
              'customers.email': 'bbuchanan3g@bloomberg.com'
            }
          ]
        }}
      />
      <br />
      <TextInput onChange={() => { }} value="Chocolate" />
      <br />
      <NumberInput onChange={() => { }} value={12} />
      <br />
    </div>
  </React.StrictMode>
);

function fakeColumnData() {
  return [
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
  ];
}

function fakeChartData() {
  return [
    {
      'customers.country': 'New Zealand',
      'transactions.created_at.week': '2017-10-30T00:00:00.000',
      'transactions.created_at': '2017-10-30T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2017-10-30T00:00:00.000',
      'transactions.created_at': '2017-10-30T00:00:00.000',
      'products.count': '4'
    },
    {
      'customers.country': 'Australia',
      'transactions.created_at.week': '2017-11-06T00:00:00.000',
      'transactions.created_at': '2017-11-06T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United Kingdom',
      'transactions.created_at.week': '2017-11-06T00:00:00.000',
      'transactions.created_at': '2017-11-06T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2017-11-06T00:00:00.000',
      'transactions.created_at': '2017-11-06T00:00:00.000',
      'products.count': '3'
    },
    {
      'customers.country': 'Belgium',
      'transactions.created_at.week': '2017-11-13T00:00:00.000',
      'transactions.created_at': '2017-11-13T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2017-11-13T00:00:00.000',
      'transactions.created_at': '2017-11-13T00:00:00.000',
      'products.count': '8'
    },
    {
      'customers.country': 'Belgium',
      'transactions.created_at.week': '2017-11-20T00:00:00.000',
      'transactions.created_at': '2017-11-20T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2017-11-20T00:00:00.000',
      'transactions.created_at': '2017-11-20T00:00:00.000',
      'products.count': '4'
    },
    {
      'customers.country': 'New Zealand',
      'transactions.created_at.week': '2017-11-20T00:00:00.000',
      'transactions.created_at': '2017-11-20T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United Kingdom',
      'transactions.created_at.week': '2017-11-20T00:00:00.000',
      'transactions.created_at': '2017-11-20T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2017-11-20T00:00:00.000',
      'transactions.created_at': '2017-11-20T00:00:00.000',
      'products.count': '8'
    },
    {
      'customers.country': 'Belgium',
      'transactions.created_at.week': '2017-11-27T00:00:00.000',
      'transactions.created_at': '2017-11-27T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2017-11-27T00:00:00.000',
      'transactions.created_at': '2017-11-27T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'New Zealand',
      'transactions.created_at.week': '2017-11-27T00:00:00.000',
      'transactions.created_at': '2017-11-27T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2017-11-27T00:00:00.000',
      'transactions.created_at': '2017-11-27T00:00:00.000',
      'products.count': '8'
    },
    {
      'customers.country': 'New Zealand',
      'transactions.created_at.week': '2017-12-04T00:00:00.000',
      'transactions.created_at': '2017-12-04T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United Kingdom',
      'transactions.created_at.week': '2017-12-04T00:00:00.000',
      'transactions.created_at': '2017-12-04T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2017-12-04T00:00:00.000',
      'transactions.created_at': '2017-12-04T00:00:00.000',
      'products.count': '11'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2017-12-11T00:00:00.000',
      'transactions.created_at': '2017-12-11T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'Iceland',
      'transactions.created_at.week': '2017-12-11T00:00:00.000',
      'transactions.created_at': '2017-12-11T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United Kingdom',
      'transactions.created_at.week': '2017-12-11T00:00:00.000',
      'transactions.created_at': '2017-12-11T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2017-12-11T00:00:00.000',
      'transactions.created_at': '2017-12-11T00:00:00.000',
      'products.count': '9'
    },
    {
      'customers.country': 'Australia',
      'transactions.created_at.week': '2017-12-18T00:00:00.000',
      'transactions.created_at': '2017-12-18T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'United Kingdom',
      'transactions.created_at.week': '2017-12-18T00:00:00.000',
      'transactions.created_at': '2017-12-18T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2017-12-18T00:00:00.000',
      'transactions.created_at': '2017-12-18T00:00:00.000',
      'products.count': '11'
    },
    {
      'customers.country': 'Belgium',
      'transactions.created_at.week': '2017-12-25T00:00:00.000',
      'transactions.created_at': '2017-12-25T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2017-12-25T00:00:00.000',
      'transactions.created_at': '2017-12-25T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'New Zealand',
      'transactions.created_at.week': '2017-12-25T00:00:00.000',
      'transactions.created_at': '2017-12-25T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2017-12-25T00:00:00.000',
      'transactions.created_at': '2017-12-25T00:00:00.000',
      'products.count': '13'
    },
    {
      'customers.country': 'Belgium',
      'transactions.created_at.week': '2018-01-01T00:00:00.000',
      'transactions.created_at': '2018-01-01T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2018-01-01T00:00:00.000',
      'transactions.created_at': '2018-01-01T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'New Zealand',
      'transactions.created_at.week': '2018-01-01T00:00:00.000',
      'transactions.created_at': '2018-01-01T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United Kingdom',
      'transactions.created_at.week': '2018-01-01T00:00:00.000',
      'transactions.created_at': '2018-01-01T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-01-01T00:00:00.000',
      'transactions.created_at': '2018-01-01T00:00:00.000',
      'products.count': '8'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2018-01-08T00:00:00.000',
      'transactions.created_at': '2018-01-08T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'New Zealand',
      'transactions.created_at.week': '2018-01-08T00:00:00.000',
      'transactions.created_at': '2018-01-08T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-01-08T00:00:00.000',
      'transactions.created_at': '2018-01-08T00:00:00.000',
      'products.count': '8'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2018-01-15T00:00:00.000',
      'transactions.created_at': '2018-01-15T00:00:00.000',
      'products.count': '4'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-01-15T00:00:00.000',
      'transactions.created_at': '2018-01-15T00:00:00.000',
      'products.count': '6'
    },
    {
      'customers.country': 'Belgium',
      'transactions.created_at.week': '2018-01-22T00:00:00.000',
      'transactions.created_at': '2018-01-22T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2018-01-22T00:00:00.000',
      'transactions.created_at': '2018-01-22T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'Iceland',
      'transactions.created_at.week': '2018-01-22T00:00:00.000',
      'transactions.created_at': '2018-01-22T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United Kingdom',
      'transactions.created_at.week': '2018-01-22T00:00:00.000',
      'transactions.created_at': '2018-01-22T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-01-22T00:00:00.000',
      'transactions.created_at': '2018-01-22T00:00:00.000',
      'products.count': '11'
    },
    {
      'customers.country': 'United Kingdom',
      'transactions.created_at.week': '2018-01-29T00:00:00.000',
      'transactions.created_at': '2018-01-29T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-01-29T00:00:00.000',
      'transactions.created_at': '2018-01-29T00:00:00.000',
      'products.count': '7'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2018-02-05T00:00:00.000',
      'transactions.created_at': '2018-02-05T00:00:00.000',
      'products.count': '3'
    },
    {
      'customers.country': 'Iceland',
      'transactions.created_at.week': '2018-02-05T00:00:00.000',
      'transactions.created_at': '2018-02-05T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'New Zealand',
      'transactions.created_at.week': '2018-02-05T00:00:00.000',
      'transactions.created_at': '2018-02-05T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-02-05T00:00:00.000',
      'transactions.created_at': '2018-02-05T00:00:00.000',
      'products.count': '7'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2018-02-12T00:00:00.000',
      'transactions.created_at': '2018-02-12T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United Kingdom',
      'transactions.created_at.week': '2018-02-12T00:00:00.000',
      'transactions.created_at': '2018-02-12T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-02-12T00:00:00.000',
      'transactions.created_at': '2018-02-12T00:00:00.000',
      'products.count': '12'
    },
    {
      'customers.country': 'Belgium',
      'transactions.created_at.week': '2018-02-19T00:00:00.000',
      'transactions.created_at': '2018-02-19T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2018-02-19T00:00:00.000',
      'transactions.created_at': '2018-02-19T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'New Zealand',
      'transactions.created_at.week': '2018-02-19T00:00:00.000',
      'transactions.created_at': '2018-02-19T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-02-19T00:00:00.000',
      'transactions.created_at': '2018-02-19T00:00:00.000',
      'products.count': '7'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2018-02-26T00:00:00.000',
      'transactions.created_at': '2018-02-26T00:00:00.000',
      'products.count': '4'
    },
    {
      'customers.country': 'New Zealand',
      'transactions.created_at.week': '2018-02-26T00:00:00.000',
      'transactions.created_at': '2018-02-26T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'United Kingdom',
      'transactions.created_at.week': '2018-02-26T00:00:00.000',
      'transactions.created_at': '2018-02-26T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-02-26T00:00:00.000',
      'transactions.created_at': '2018-02-26T00:00:00.000',
      'products.count': '15'
    },
    {
      'customers.country': 'Belgium',
      'transactions.created_at.week': '2018-03-05T00:00:00.000',
      'transactions.created_at': '2018-03-05T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2018-03-05T00:00:00.000',
      'transactions.created_at': '2018-03-05T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United Kingdom',
      'transactions.created_at.week': '2018-03-05T00:00:00.000',
      'transactions.created_at': '2018-03-05T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-03-05T00:00:00.000',
      'transactions.created_at': '2018-03-05T00:00:00.000',
      'products.count': '9'
    },
    {
      'customers.country': 'Australia',
      'transactions.created_at.week': '2018-03-12T00:00:00.000',
      'transactions.created_at': '2018-03-12T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'Belgium',
      'transactions.created_at.week': '2018-03-12T00:00:00.000',
      'transactions.created_at': '2018-03-12T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-03-12T00:00:00.000',
      'transactions.created_at': '2018-03-12T00:00:00.000',
      'products.count': '9'
    },
    {
      'customers.country': 'Australia',
      'transactions.created_at.week': '2018-03-19T00:00:00.000',
      'transactions.created_at': '2018-03-19T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'Belgium',
      'transactions.created_at.week': '2018-03-19T00:00:00.000',
      'transactions.created_at': '2018-03-19T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2018-03-19T00:00:00.000',
      'transactions.created_at': '2018-03-19T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'Iceland',
      'transactions.created_at.week': '2018-03-19T00:00:00.000',
      'transactions.created_at': '2018-03-19T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'New Zealand',
      'transactions.created_at.week': '2018-03-19T00:00:00.000',
      'transactions.created_at': '2018-03-19T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'United Kingdom',
      'transactions.created_at.week': '2018-03-19T00:00:00.000',
      'transactions.created_at': '2018-03-19T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-03-19T00:00:00.000',
      'transactions.created_at': '2018-03-19T00:00:00.000',
      'products.count': '13'
    },
    {
      'customers.country': 'Australia',
      'transactions.created_at.week': '2018-03-26T00:00:00.000',
      'transactions.created_at': '2018-03-26T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'Iceland',
      'transactions.created_at.week': '2018-03-26T00:00:00.000',
      'transactions.created_at': '2018-03-26T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-03-26T00:00:00.000',
      'transactions.created_at': '2018-03-26T00:00:00.000',
      'products.count': '5'
    },
    {
      'customers.country': 'Australia',
      'transactions.created_at.week': '2018-04-02T00:00:00.000',
      'transactions.created_at': '2018-04-02T00:00:00.000',
      'products.count': '3'
    },
    {
      'customers.country': 'Belgium',
      'transactions.created_at.week': '2018-04-02T00:00:00.000',
      'transactions.created_at': '2018-04-02T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2018-04-02T00:00:00.000',
      'transactions.created_at': '2018-04-02T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'New Zealand',
      'transactions.created_at.week': '2018-04-02T00:00:00.000',
      'transactions.created_at': '2018-04-02T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'United Kingdom',
      'transactions.created_at.week': '2018-04-02T00:00:00.000',
      'transactions.created_at': '2018-04-02T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-04-02T00:00:00.000',
      'transactions.created_at': '2018-04-02T00:00:00.000',
      'products.count': '11'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2018-04-09T00:00:00.000',
      'transactions.created_at': '2018-04-09T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'United Kingdom',
      'transactions.created_at.week': '2018-04-09T00:00:00.000',
      'transactions.created_at': '2018-04-09T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-04-09T00:00:00.000',
      'transactions.created_at': '2018-04-09T00:00:00.000',
      'products.count': '10'
    },
    {
      'customers.country': 'Australia',
      'transactions.created_at.week': '2018-04-16T00:00:00.000',
      'transactions.created_at': '2018-04-16T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'Belgium',
      'transactions.created_at.week': '2018-04-16T00:00:00.000',
      'transactions.created_at': '2018-04-16T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2018-04-16T00:00:00.000',
      'transactions.created_at': '2018-04-16T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'New Zealand',
      'transactions.created_at.week': '2018-04-16T00:00:00.000',
      'transactions.created_at': '2018-04-16T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United Kingdom',
      'transactions.created_at.week': '2018-04-16T00:00:00.000',
      'transactions.created_at': '2018-04-16T00:00:00.000',
      'products.count': '3'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-04-16T00:00:00.000',
      'transactions.created_at': '2018-04-16T00:00:00.000',
      'products.count': '8'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2018-04-23T00:00:00.000',
      'transactions.created_at': '2018-04-23T00:00:00.000',
      'products.count': '3'
    },
    {
      'customers.country': 'Iceland',
      'transactions.created_at.week': '2018-04-23T00:00:00.000',
      'transactions.created_at': '2018-04-23T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'New Zealand',
      'transactions.created_at.week': '2018-04-23T00:00:00.000',
      'transactions.created_at': '2018-04-23T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'United Kingdom',
      'transactions.created_at.week': '2018-04-23T00:00:00.000',
      'transactions.created_at': '2018-04-23T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-04-23T00:00:00.000',
      'transactions.created_at': '2018-04-23T00:00:00.000',
      'products.count': '14'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2018-04-30T00:00:00.000',
      'transactions.created_at': '2018-04-30T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United Kingdom',
      'transactions.created_at.week': '2018-04-30T00:00:00.000',
      'transactions.created_at': '2018-04-30T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-04-30T00:00:00.000',
      'transactions.created_at': '2018-04-30T00:00:00.000',
      'products.count': '10'
    },
    {
      'customers.country': 'Belgium',
      'transactions.created_at.week': '2018-05-07T00:00:00.000',
      'transactions.created_at': '2018-05-07T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2018-05-07T00:00:00.000',
      'transactions.created_at': '2018-05-07T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'New Zealand',
      'transactions.created_at.week': '2018-05-07T00:00:00.000',
      'transactions.created_at': '2018-05-07T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United Kingdom',
      'transactions.created_at.week': '2018-05-07T00:00:00.000',
      'transactions.created_at': '2018-05-07T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-05-07T00:00:00.000',
      'transactions.created_at': '2018-05-07T00:00:00.000',
      'products.count': '10'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2018-05-14T00:00:00.000',
      'transactions.created_at': '2018-05-14T00:00:00.000',
      'products.count': '3'
    },
    {
      'customers.country': 'New Zealand',
      'transactions.created_at.week': '2018-05-14T00:00:00.000',
      'transactions.created_at': '2018-05-14T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-05-14T00:00:00.000',
      'transactions.created_at': '2018-05-14T00:00:00.000',
      'products.count': '5'
    },
    {
      'customers.country': 'Germany',
      'transactions.created_at.week': '2018-05-21T00:00:00.000',
      'transactions.created_at': '2018-05-21T00:00:00.000',
      'products.count': '2'
    },
    {
      'customers.country': 'Iceland',
      'transactions.created_at.week': '2018-05-21T00:00:00.000',
      'transactions.created_at': '2018-05-21T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'New Zealand',
      'transactions.created_at.week': '2018-05-21T00:00:00.000',
      'transactions.created_at': '2018-05-21T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-05-21T00:00:00.000',
      'transactions.created_at': '2018-05-21T00:00:00.000',
      'products.count': '6'
    },
    {
      'customers.country': 'United Kingdom',
      'transactions.created_at.week': '2018-05-28T00:00:00.000',
      'transactions.created_at': '2018-05-28T00:00:00.000',
      'products.count': '1'
    },
    {
      'customers.country': 'United States',
      'transactions.created_at.week': '2018-05-28T00:00:00.000',
      'transactions.created_at': '2018-05-28T00:00:00.000',
      'products.count': '5'
    }
  ];
}
