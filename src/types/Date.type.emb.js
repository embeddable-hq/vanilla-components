import { defineType } from "@embeddable.com/core";

export default defineType("time", {
  label: "Time",
  defaultValue: null,
  toString: (date) => `${date}`,
  deserialize: (json) => (json && new Date(json)) || null,
  toNativeDataType: {
    string: (date) => date,
    time: (date) => date,
  },
});