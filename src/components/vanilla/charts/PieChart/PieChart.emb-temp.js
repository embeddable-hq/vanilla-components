import { loadData } from "@embeddable.com/core";
export const meta = {
  name: "PieChart",
  label: "Chart: Pie",
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
    name: "slice",
    type: "dimension",
    label: "Slice",
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
    label: "Turn on the legend",
    defaultValue: true,
    category: "Chart settings"
  }, {
    name: "maxSegments",
    type: "number",
    label: "Max Legend items",
    defaultValue: 8,
    category: "Chart settings"
  }, {
    name: "showLabels",
    type: "boolean",
    label: "Show Labels",
    defaultValue: false,
    category: "Chart settings"
  }, {
    name: "dps",
    type: "number",
    label: "Decimal Places",
    category: "Formatting"
  }]
};