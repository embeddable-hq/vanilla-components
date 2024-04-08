import { EmbeddedComponentMeta, defineComponent } from "@embeddable.com/react";
import Component from './index';



export const meta: EmbeddedComponentMeta = {
    name: 'SmartifySpacing',
    label: 'Smartify Spacing',
    inputs: [
        {
            name: 'spacing',
            type: 'number',
            label: 'Margin Top and Bottom',
            description: 'Total pixels that will be added above and below the separator line',
            category: 'Configure chart'
        }
    ]
};

export type Inputs = {
    spacing?: number;
    thickness?: number;
};

export default defineComponent<Inputs>(Component, meta, {
    props: (inputs) => {
        return {
            ...inputs
        }
    },
})