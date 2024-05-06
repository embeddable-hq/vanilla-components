import { loadData } from "@embeddable.com/core";
export const meta = {
  name: "StackedBarChart",
  label: "Chart: Stacked Bar",
  classNames: ["inside-card"],
  inputs: [{
    name: "title",
    type: "string",
    label: "Title",
    description: "The title for the chart",
    category: "Configure chart"
  }, {
    name: "ds",
    type: "dataset",
    label: "Dataset to display",
    category: "Configure chart"
  }, {
    name: "xAxis",
    type: "dimension",
    label: "X-Axis",
    config: {
      dataset: "ds"
    },
    category: "Configure chart"
  }, {
    name: "segment",
    type: "dimension",
    label: "Segment",
    config: {
      dataset: "ds"
    },
    category: "Configure chart"
  }, {
    name: "metric",
    type: "measure",
    label: "Metric",
    config: {
      dataset: "ds"
    },
    category: "Configure chart"
  }, {
    name: "showLegend",
    type: "boolean",
    label: "Show legend",
    defaultValue: true,
    category: "Chart settings"
  }, {
    name: "maxSegments",
    type: "number",
    label: "Max Legend Items",
    defaultValue: 8,
    category: "Chart settings"
  }, {
    name: "showLabels",
    type: "boolean",
    label: "Show Labels",
    defaultValue: false,
    category: "Chart settings"
  }, {
    name: "displayHorizontally",
    type: "boolean",
    label: "Display Horizontally",
    defaultValue: false,
    category: "Chart settings"
  }, {
    name: "displayAsPercentage",
    type: "boolean",
    label: "Display as Percentages",
    defaultValue: false,
    category: "Chart settings"
  }, {
    name: "dps",
    type: "number",
    label: "Decimal Places",
    category: "Formatting"
  }]
};