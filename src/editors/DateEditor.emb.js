import { defineEditor } from "@embeddable.com/react";
import DateRangeType from "../types/DateRange.type.emb.js";
import DateRangePicker from "../components/DateRangePicker/DateRangePicker";

export const meta = {
  name: "DateRangeEditor",
  label: "Date range",
  type: DateRangeType,
};

export default defineEditor(DateRangePicker, meta, {
  inputs: (value, setter) => ({
    value,
    onChange: (val) => setter(val),
  }),
});