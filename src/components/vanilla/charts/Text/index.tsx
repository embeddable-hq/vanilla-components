// React Data Grid Component
import 'ag-grid-community/styles/ag-grid.css';
// Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact } from 'ag-grid-react';
// Optional Theme applied to the Data Grid
import React from 'react';

import Container from '../../Container';

// Optional Theme applied to the Data Grid

type Props = {
  title: string;
  body: string;
};

export default (props: Props) => {
  const [rowData, setRowData] = React.useState([
    { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
    { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
    { make: 'Toyota', model: 'Corolla', price: 29600, electric: false }
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = React.useState([
    { field: 'make' },
    { field: 'model' },
    { field: 'price' },
    { field: 'electric' }
  ]);

  return (
    <Container title={props.title} description={props.body}>
      <div
        className="ag-theme-quartz" // applying the Data Grid theme
        style={{ height: 500 }} // the Data Grid will fill the size of the parent container
      >
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </div>
    </Container>
  );
};
