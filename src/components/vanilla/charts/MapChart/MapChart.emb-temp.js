import { loadData } from "@embeddable.com/core";
export const meta = {
  name: "MapChart",
  label: "Chart: Map",
  defaultHeight: 650,
  defaultWidth: 1130,
  inputs: [{
    name: "title",
    type: "string",
    label: "Title",
    description: "The title for the chart",
    category: "Configure chart"
  }, {
    name: "ds",
    type: "dataset",
    label: "Dataset",
    description: "Dataset",
    defaultValue: false,
    category: "Configure chart"
  }, {
    name: "segments",
    type: "dimension",
    label: "Segments",
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
  }]
};