import { EmbeddedComponentMeta, defineComponent } from "@embeddable.com/react";
import Component from './index';



export const meta = {
    name: 'SmartifySeparator',
    label: 'Smartify Separator Spacing',
    category: 'Smartify: Report Fortmatting',
    inputs: [
        {
            name: 'spacing',
            type: 'number',
            label: 'Margin Top and Bottom',
            description: 'Total pixels that will be added above and below the separator line',
            category: 'Configure chart'
        },
        {
            name: 'thickness',
            type: 'number',
            label: 'Thickness of the line',
            description: 'How thick should be the separator line',
            category: 'Configure chart'
        },
        {
            name: 'color',
            type: 'string',
            label: 'Color of the line',
            description: 'You got it right...',
            category: 'Configure chart'
        }
    ]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
    props: (inputs) => {
        return {
            ...inputs
        }
    },
})