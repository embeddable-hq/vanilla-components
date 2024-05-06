import { isDimension, isMeasure, loadData } from "@embeddable.com/core";
export const meta = {
  name: "TableChart",
  label: "Chart: Table",
  defaultHeight: 300,
  defaultWidth: 900,
  classNames: ["inside-card"],
  inputs: [{
    name: "title",
    type: "string",
    label: "Title",
    category: "Configure chart"
  }, {
    name: "ds",
    type: "dataset",
    label: "Dataset to display",
    description: "Dataset",
    defaultValue: false,
    category: "Configure chart"
  }, {
    name: "columns",
    type: "dimensionOrMeasure",
    label: "Columns",
    array: true,
    config: {
      dataset: "ds"
    },
    category: "Configure chart"
  }, {
    name: "maxPageRows",
    type: "number",
    label: "Max Page Rows",
    category: "Chart settings"
  }, {
    name: "defaultSort",
    type: "dimensionOrMeasure",
    config: {
      dataset: "ds"
    },
    label: "Default Sort",
    category: "Chart settings"
  }, {
    name: "defaultSortDirection",
    type: SortDirectionType,
    defaultValue: "Ascending",
    label: "Default Sort Direction",
    category: "Chart settings"
  }]
};