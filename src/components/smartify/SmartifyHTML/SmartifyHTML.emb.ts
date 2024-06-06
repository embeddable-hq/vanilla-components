import { EmbeddedComponentMeta, defineComponent } from "@embeddable.com/react";
import Component from './index';

export const meta: EmbeddedComponentMeta = {
    name: 'SmartifyHTML',
    label: 'Smartify HTML',
    inputs: [
        {
            name: 'HTMLCode',
            type: 'string',
            label: 'HTML CODE',
            description: 'Paste the long code of your HTML',
            category: 'Configure chart'
        }
    ]
};

export type Inputs = {
    SmartifyHTML?: string;
};

export default defineComponent<Inputs>(Component, meta, {
    props: (inputs) => {
        return {
            SmartifyHTML: inputs.SmartifyHTML
        }
    }
})