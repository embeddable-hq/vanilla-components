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

import Tom from './components/Tom';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="p-8">
      <Tom
        showLegend
        yAxis={{
          name: 'transactions.count',
          title: 'Count',
          __type__: 'measure',
          nativeType: 'number',
          description: 'Count of transactions'
        }}
        xAxis={{
          name: 'transactions.created_at',
          title: 'Created at',
          nativeType: 'time',
          __type__: 'dimension',
          description: 'The time when the transaction was created'
        }}
        title="test"
        results={{
          isLoading: false,
          data: [
            {
              'transactions.created_at': '2018-02-28T00:00:00.000',
              'transactions.count': '15'
            },
            {
              'transactions.created_at': '2018-04-28T00:00:00.000',
              'transactions.count': '11'
            },
            {
              'transactions.created_at': '2018-03-08T00:00:00.000',
              'transactions.count': '8'
            },
            {
              'transactions.created_at': '2018-04-23T00:00:00.000',
              'transactions.count': '7'
            },
            {
              'transactions.created_at': '2018-05-25T00:00:00.000',
              'transactions.count': '1'
            },
            {
              'transactions.created_at': '2018-02-03T00:00:00.000',
              'transactions.count': '1'
            }
          ]
        }}
      />
      <Table
        columns={[
          {
            name: 'courses_in_progress.full_name',
            title: 'Full Name',
            description: null
          },
          {
            name: 'courses_in_progress.count',
            title: 'Count',
            description: null
          }
        ]}
        title="Courses In Progress"
        table={{
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
      <br />
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
      <br />
      <ColumnChart
        title=""
        columns={{ isLoading: false, data: [] }}
        count={{ name: '', title: '', description: '' }}
        groupingA={{ name: '', title: '', description: '' }}
        groupingB={{ name: '', title: '', description: '' }}
        // showLabels
        showLegend
      />
      <br />
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
      <br />
    </div>
  </React.StrictMode>
);
