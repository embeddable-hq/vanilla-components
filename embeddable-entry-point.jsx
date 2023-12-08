import 'vite/modulepreload-polyfill';


import React from 'react';
import ReactDOM from 'react-dom/client';

const COMPONENT_MAP = {
	BarChart: React.lazy(() => import('./src/components/BarChart/BarChart.emb.js')),
	DateRangePicker: React.lazy(() => import('./src/components/DateRangePicker/DateRangePicker.emb.js')),
	DonutChart: React.lazy(() => import('./src/components/DonutChart/DonutChart.emb.js')),
	Dropdown: React.lazy(() => import('./src/components/Dropdown/Dropdown.emb.js')),
	MetricSeries: React.lazy(() => import('./src/components/MetricSeries/MetricSeries.emb.js')),
	NumberInput: React.lazy(() => import('./src/components/NumberInput/NumberInput.emb.js')),
	SingleValue: React.lazy(() => import('./src/components/SingleValue/SingleValue.emb.js')),
	Table: React.lazy(() => import('./src/components/Table/Table.emb.js')),
	TextInput: React.lazy(() => import('./src/components/TextInput/TextInput.emb.js')),
	TimeSeriesLineChart1: React.lazy(() => import('./src/components/TimeSeriesLineChart1/TimeSeriesLineChart1.emb.js'))
};

export default (rootEl, componentName, props) => {
    const Component = COMPONENT_MAP[componentName];
    const root = ReactDOM.createRoot(rootEl);
    const unmountHandler = () => {
        root.unmount();
        rootEl.removeEventListener('EMBEDDABLE_COMPONENT:UNMOUNT', unmountHandler);
    };
    root.render(
    <ErrorBoundary fallback={null}>
        <React.Suspense fallback={<div/>}>
            <Component {...props} propsUpdateListener={rootEl} />
        </React.Suspense>
    </ErrorBoundary>
    );
    rootEl.addEventListener('EMBEDDABLE_COMPONENT:UNMOUNT', unmountHandler);
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.props.fallback) {
      const FallbackComponent = this.props.fallback;
      return <FallbackComponent error={this.state.error} />
    }

    return this.props.children;
  }
}