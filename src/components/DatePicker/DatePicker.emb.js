import {defineComponent} from "@embeddable.com/react";
import DateType from '../../types/Date.type.emb.js';
import DatePicker from "./DatePicker.jsx";

export const meta = {
    name: 'DatePicker',
    label: 'Date picker',
    events: [
        {
            name: 'onChange',
            label: 'Change',
            properties: [
                {
                    name: 'date',
                    type: DateType,
                },
            ],
        },
    ],
};

export default defineComponent(
    DatePicker,
    meta,
    {
        props: ({value}) => ({value}),
        events: {
            onChange: (date) => ({date})
        }
    },
);
