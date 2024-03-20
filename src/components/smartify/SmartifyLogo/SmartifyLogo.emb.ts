import { EmbeddedComponentMeta, defineComponent } from "@embeddable.com/react";
import Component from './index';

export const meta: EmbeddedComponentMeta = {
    name: 'SmartifyLogo',
    label: 'Smartify Logo',
    inputs: [
        {
            name: 'logoUrl',
            type: 'string',
            label: 'Logo URL',
            description: 'Past the logo URL you want to have',
            category: 'Configure chart'
        }
    ]
};

export type Inputs = {
    logoUrl?: string;
};

export default defineComponent<Inputs>(Component, meta, {
    props: (inputs) => {
        return {
            logoUrl: inputs.logoUrl
        }
    }
})