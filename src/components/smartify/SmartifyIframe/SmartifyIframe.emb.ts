import { EmbeddedComponentMeta, defineComponent } from "@embeddable.com/react";
import Component from './index';

export const meta: EmbeddedComponentMeta = {
    name: 'SmartifyIframe',
    label: 'Smartify iFrame',
    inputs: [
        {
            name: 'iFrameUrl',
            type: 'string',
            label: 'iFrame URL',
            description: 'Paste the url from the iframe',
            category: 'Configure chart'
        }
    ]
};

export type Inputs = {
    iFrameUrl?: string;
};

export default defineComponent<Inputs>(Component, meta, {
    props: (inputs) => {
        return {
            iFrameUrl: inputs.iFrameUrl
        }
    }
})