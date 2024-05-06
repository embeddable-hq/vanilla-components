import { Value, loadData } from "@embeddable.com/core";
export const meta = {
  name: "Dropdown",
  label: "Control: Dropdown",
  defaultWidth: 300,
  defaultHeight: 80,
  classNames: ["on-top"],
  inputs: [{
    name: "title",
    type: "string",
    label: "Title",
    category: "Configuration"
  }, {
    name: "ds",
    type: "dataset",
    label: "Dataset",
    description: "Dataset",
    category: "Configuration"
  }, {
    name: "property",
    type: "dimension",
    label: "Property",
    config: {
      dataset: "ds"
    },
    category: "Configuration"
  }, {
    name: "defaultValue",
    type: "string",
    label: "Default value",
    category: "Settings"
  }, {
    name: "placeholder",
    type: "string",
    label: "Placeholder",
    category: "Settings"
  }],
  events: [{
    name: "onChange",
    label: "Change",
    properties: [{
      name: "value",
      type: "string"
    }]
  }],
  variables: [{
    name: "dropdown choice",
    type: "string",
    defaultValue: Value.noFilter(),
    inputs: ["defaultValue"],
    events: [{
      name: "onChange",
      property: "value"
    }]
  }]
};