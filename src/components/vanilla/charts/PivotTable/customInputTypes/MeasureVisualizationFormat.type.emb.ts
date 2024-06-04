import { defineOption, defineType } from '@embeddable.com/core';
import { MeasureVisualizationFormat } from '../enums/MeasureVisualizationFormat';

const MetricsVisualizationFormat = defineType('metricsVisualizationFormat', {
  label: 'Metrics visualization format',
  optionLabel: (direction) => direction.value
});

defineOption(MetricsVisualizationFormat, { value: MeasureVisualizationFormat.NUMERIC_VALUES_ONLY });

defineOption(MetricsVisualizationFormat, { value: MeasureVisualizationFormat.VALUE_BARS });

// defineOption(MetricsVisualizationFormat, { value: MeasureVisualizationFormat.HEATMAP });

export default MetricsVisualizationFormat;
