import React from 'react';
import ReactDOM from 'react-dom/client';

import './vanilla/index.css';
import Dropdown from './vanilla/controls/Dropdown';
import TextInput from './vanilla/controls/TextInput';
import BasicPieComponent from './vanilla/charts/BasicPieComponent';
import BasicLineComponent from './vanilla/charts/BasicLineComponent';
import BasicBarComponent from './vanilla/charts/BasicBarComponent';
import BasicStackedBarComponent from './vanilla/charts/BasicStackedBarComponent';
import BasicTextComponent from './vanilla/charts/BasicTextComponent';
import NumberInput from './vanilla/controls/NumberInput';
import LineChart from './vanilla/charts/LineChart';
import Table from './vanilla/charts/Table';
import DateRangePicker from './vanilla/controls/DateRangePicker';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="p-8 w-[1000px]">
      <div className='w-full h-[100px]'>
        <BasicTextComponent
          title="hello"
          body="my body"
        />
      </div>
      <div className='w-full h-[500px]'>
        <BasicStackedBarComponent
          title='My first Stacked Barchart'
          showLegend={true}
          displayHorizontally={true}
          ds={false}
          xAxis={{ name: 'platform' }}
          segment={{ name: 'country' }}
          metrics={{ name: 'users', title: 'total users'}}
          yAxisMin={0}
          maxSegments={5}
          showLabels={true}
          displayAsPercentage={false}
          results={{
            isLoading: false,
            error: null,
            data: [
              { platform: "Slack", country: "US", users: 10 },
              { platform: "Slack", country: "UK", users: 15 },
              { platform: "Slack", country: "Germany", users: 18 },
              { platform: "Slack", country: "Chile", users: 23 },
              { platform: "Slack", country: "Australia", users: "1" },
              { platform: "Salesforce", country: "US", users: '10' },
              { platform: "Salesforce", country: "UK", users: 15 },
              { platform: "Salesforce", country: "Ireland", users: 18 },
              { platform: "Salesforce", country: "Uruguay", users: 23 },
              { platform: "Salesforce", country: "Australia", users: 10 },
              { platform: "Netlify", country: "US", users: 10 },
              { platform: "Netlify", country: "UK", users: 25 },
              { platform: "Netlify", country: "Ireland", users: 48 },
              { platform: "Netlify", country: "Belgium", users: 233 },
              { platform: "Netlify", country: "Canada", users: 10 },
              { platform: "Notion", country: "US", users: 10 },
              { platform: "Notion", country: "Argentina", users: 25 },
              { platform: "Notion", country: "Ireland", users: 48 },
              { platform: "Notion", country: "Belgium", users: 233 },
              { platform: "Notion", country: "Canada", users: 10 },
              { platform: "Tableau", country: "Finland", users: 10 },
              { platform: "Tableau", country: "UK", users: 25 },
              { platform: "Tableau", country: "Ireland", users: 48 },
              { platform: "Tableau", country: "Belgium", users: 23 },
              { platform: "Tableau", country: "Russia", users: 10 },
              { platform: "Embeddable", country: "US", users: 10 },
              { platform: "Embeddable", country: "UK", users: 25 },
              { platform: "Embeddable", country: "Norway", users: 48 },
              { platform: "Embeddable", country: "Belgium", users: 3 },
              { platform: "Embeddable", country: "Canada", users: 10 },
            ]
          }}
        />
      </div>
      <div className='w-full h-[500px]'>
        <BasicBarComponent
          title='My first Barchart'
          showLegend={undefined}
          ds={false}
          xAxis={{ name: 'country'}}
          metrics={[
            { name: 'count', title: '# of customers'},
            { name: 'avg', title: 'Average of customers'},
            { name: 'sum', title: 'Sum of $'}
            ]}
          yAxisMin={0}
          showLabels={true}
          stackMetrics={false}
          results={{
            isLoading: false,
            error: null,
            data: [
              // { country: '2023-12-21T00:00:00.000', count: 23 },
              // { country: '2023-10-21T00:00:00.000', count: 38 },
              // { country: '2023-08-21T00:00:00.000', count: 5 },
              // { country: '2023-04-21T00:00:00.000', count: 23 },
              // { country: '2023-01-21T00:00:00.000', count: 100 },
              // { country: '2023-12-21T00:00:00.000', count: 50 },
              // { country: '2023-12-21T00:00:00.000', count: 23 },
              // { country: '2023-06-21T00:00:00.000', count: 14 },
              // { country: '2023-03-21T00:00:00.000', count: 5 }
              { country: 'UK', count: '0', avg: '11', sum: '85' },
              { country: 'US', count: '23', avg: '15', sum: '6' },
              { country: 'Germany', count: 5, avg: 7, sum: 122 },
              { country: 'Iceland', count: 23, avg: 15, sum: 1 },
              { country: 'Finland', count: 100, avg: 11, sum: 22 },
              { country: 'Sweden', count: 50, avg: 7, sum: 35 },
              { country: 'Spain', count: 23, avg: 15, sum: 60 },
              { country: 'Greece', count: 14, avg: 11, sum: 102 },
              { country: 'Awesomeland', count: 5, avg: 7, sum: 12 }
            ]
          }}
        />
      </div>

      <div className='w-full h-[500px]'>
        <BasicLineComponent
          title='My first line chart'
          showLegend={true}
          ds={false}
          xAxis={{ name: 'transactions.created_at'}}
          metrics={[
            { name: 'products.count', title: '# of customers'},
            ]}
          yAxisMin={0}
          showLabels={true}
          applyFill={false}
          results={{
            isLoading: false,
            error: null,
            data: fakeChartData()
            // [
            //   { country: '2023-12-21T00:00:00.000', count: 23 },
            //   { country: '2023-10-21T00:00:00.000', count: 38 },
            //   { country: '2023-08-21T00:00:00.000', count: 5 },
            //   { country: '2023-04-21T00:00:00.000', count: 23 },
            //   { country: '2023-01-21T00:00:00.000', count: 100 },
            //   { country: '2023-12-21T00:00:00.000', count: 50 },
            //   { country: '2023-12-21T00:00:00.000', count: 23 },
            //   { country: '2023-06-21T00:00:00.000', count: 14 },
            //   { country: '2023-03-21T00:00:00.000', count: 5 }
              // { country: 'UK', count: 10, avg: 11 },
              // { country: 'US', count: 23, avg: 15 },
              // { country: 'UK', count: 10, avg: 11 },
              // { country: 'Germany', count: 5, avg: 7 },
              // { country: 'Iceland', count: 23, avg: 15 },
              // { country: 'Finland', count: 100, avg: 11 },
              // { country: 'Sweden', count: 50, avg: 7 },
              // { country: 'Spain', count: 23, avg: 15 },
              // { country: 'Greece', count: 14, avg: 11 },
              // { country: 'Awesomeland', count: 5, avg: 7 }
            //]
          }}
        />
      </div>
      <div className='w-full h-[400px]'>
        <BasicPieComponent
            ds={true}
            slice={{ name: 'country'}}
            metric={{ name: 'count'}}
            showLegend={true}
            showLabels={true}
            title={"TEST PIE!"}
            maxSegments={5}
            results={{
              isLoading: false,
              error: null,
              data: [
                { country: 'US', count: 23 },
                { country: 'UK', count: 10 },
                { country: 'Germany', count: 5 }
              ],
            //   data: [
            //   {
            //     'courses_in_progress.full_name': 'SPHERE F BLOCK',
            //     'courses_in_progress.count': 38
            //   },
            //   {
            //     'courses_in_progress.full_name': 'Research Skills',
            //     'courses_in_progress.count': 37
            //   },
            //   {
            //     'courses_in_progress.full_name': 'Journal Test',
            //     'courses_in_progress.count': 37
            //   },
            //   {
            //     'courses_in_progress.full_name': 'Applying for University',
            //     'courses_in_progress.count': 36
            //   },
            //   {
            //     'courses_in_progress.full_name': 'Creative Problem Solving',
            //     'courses_in_progress.count': 36
            //   },
            //   {
            //     'courses_in_progress.full_name': 'Critical Thinking',
            //     'courses_in_progress.count': 36
            //   },
            //   {
            //     'courses_in_progress.full_name': 'CV Writing',
            //     'courses_in_progress.count': 36
            //   },
            //   {
            //     'courses_in_progress.full_name': 'Entrepreneurship',
            //     'courses_in_progress.count': 36
            //   },
            //   {
            //     'courses_in_progress.full_name': 'Job Interview Skills',
            //     'courses_in_progress.count': 36
            //   },
            //   {
            //     'courses_in_progress.full_name': 'Making an Impact',
            //     'courses_in_progress.count': 36
            //   },
            //   {
            //     'courses_in_progress.full_name': 'Personal Statement Writing',
            //     'courses_in_progress.count': 36
            //   },
            //   {
            //     'courses_in_progress.full_name': 'Preparing for LNAT',
            //     'courses_in_progress.count': 36
            //   },
            //   {
            //     'courses_in_progress.full_name': 'Preparing for TSA',
            //     'courses_in_progress.count': 36
            //   },
            //   {
            //     'courses_in_progress.full_name': 'Public Speaking',
            //     'courses_in_progress.count': 36
            //   },
            //   {
            //     'courses_in_progress.full_name': 'University Interview Skills',
            //     'courses_in_progress.count': 36
            //   },
            //   {
            //     'courses_in_progress.full_name': 'Verbal Communication',
            //     'courses_in_progress.count': 36
            //   },
            //   {
            //     'courses_in_progress.full_name': 'Writing Skills',
            //     'courses_in_progress.count': 36
            //   },
            //   {
            //     'courses_in_progress.full_name': 'Resilience',
            //     'courses_in_progress.count': 36
            //   },
            //   {
            //     'courses_in_progress.full_name': 'Preparing for BMAT',
            //     'courses_in_progress.count': 36
            //   },
            //   {
            //     'courses_in_progress.full_name': 'SPHERE C Block',
            //     'courses_in_progress.count': 18
            //   },
            //   {
            //     'courses_in_progress.full_name': 'Questionnaire Journal',
            //     'courses_in_progress.count': 5
            //   },
            //   {
            //     'courses_in_progress.full_name': 'Study Skills',
            //     'courses_in_progress.count': 2
            //   },
            //   {
            //     'courses_in_progress.full_name': 'SPHERE EtonX Platform Training',
            //     'courses_in_progress.count': 1
            //   }
            // ]
            }}
        />
      </div>
      
      <Dropdown
        title="test"
        onChange={([a, b]) => console.log('Dropdown.onChange', {a, b})}
        property={{
          name: 'customers.country',
          title: 'Country',
          nativeType: 'string'
        }}
        defaultValue="Germany"
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
      <DateRangePicker onChange={() => {}} />
      <Dropdown
        onChange={() => {}}
        property={{
          name: 'customers.email',
          title: 'Email',
          description: '',
          nativeType: 'string',
          __type__: 'dimension'
        }}
        title="test"
        defaultValue=""
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
      <TextInput placeholder="Provide text" onChange={(e) => console.log('text.value', e)} value="Chocolate" />
      <NumberInput placeholder="Provide number" onChange={() => {}} value={12} />
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
