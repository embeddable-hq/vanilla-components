import { Dataset, Measure, loadData } from "@embeddable.com/core";
import { EmbeddedComponentMeta, defineComponent } from "@embeddable.com/react";

import Component from './index';

export const meta: EmbeddedComponentMeta = {
    name: 'SmartifySimpleKPI',
    label: 'Smartify Simple KPI',
   inputs: [
        {
            name: 'title',
            type: 'string',
            label: 'Title',
            description: 'Select the chart title'
        },
        {
            name: 'ds',
            type: 'dataset',
            label: 'Dataset',
            description: 'Dataset'
        },
        {
            name: 'metric',
            type: 'measure',
            label: 'Metric_KPI',
            config: {
                dataset: 'ds'
            }
        },
        /*{
            name: 'color',
            type: 'string',
            label: 'Smart color choice'
        },*/
        {
            name: 'colorDeco',
            type: 'string',
            label: 'Border color'
        },
        {
            name: 'colorBg',
            type: 'string',
            label: 'Background color'
        },
        {
            name: 'description',
            type: 'string',
            label: 'Metric description'
        },
        {
            name: 'prefix',
            type: 'string',
            label: 'Prefix',
            description: 'Prefix',
            category: 'Chart settings'
          },
          {
            name: 'suffix',
            type: 'string',
            label: 'Suffix',
            description: 'Suffix',
            category: 'Chart settings'
          }
    ],
    events: []
};

export type Inputs = {
    title?: string;
    ds: Dataset;
    metric: Measure;
    prefix: string;
    colorDeco: string;
    colorBg: string;
    suffix: string;
};

export default defineComponent<Inputs>(Component, meta, {
    props: (inputs) => {
        return {
            ...inputs,
            value: loadData({
                from: inputs.ds,
                measures: [inputs.metric]
            })
        }
    }
})