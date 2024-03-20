import { EmbeddedComponentMeta, defineComponent } from "@embeddable.com/react";
import Component from './index';

export const meta: EmbeddedComponentMeta = {
    name: 'SmartifyH1Title',
    label: 'Smartify H1 Title',
    inputs: [
        {
            name: 'title',
            type: 'string',
            label: 'Title',
            description: 'Insert desired title',
            category: 'Configure chart'
        }
    ]
};

export type Inputs = {
    title?: string;
};

export default defineComponent<Inputs>(Component, meta, {
    props: (inputs) => {
        return {
            title: inputs.title
        }
    }
})