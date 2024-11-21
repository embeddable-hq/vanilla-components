import { useEmbeddableState } from '@embeddable.com/react';
import { Dimension, Granularity } from '@embeddable.com/core';
import React, {useState} from 'react';
import Container from '../../Container';
import Dropdown from '../Dropdown';

export type Props = {
    onChange: (object: object) => void
    defaultValue: Granularity;
    second?: boolean;
    minute?: boolean;
    hour?: boolean;
    day?: boolean;
    week?: boolean;
    month?: boolean;
    quarter?: boolean;
    year?: boolean;
};

type TimeRange = {
    to?: Date;
    from?: Date;
    relativeTimeString?: string;
};

type GranularityResponse = {
    isLoading: boolean;
    data: { value: string }[];
}

export default (props: Props) => {

    const [granularity, setGranularity] = useState(props.defaultValue)
  
    const options: Granularity[] = [
        'second',
        'minute',
        'hour',
        'day',
        'week',
        'month',
        'quarter',
        'year'
    ];

    const timeFilters: { [key: string]: string | undefined } = {
        second: 'last 1 minute',
        minute: 'last 1 hour',
        hour: 'last 24 hours',
        day: 'last 30 days',
        week: 'last 12 months',
        month: 'last 24 months',
        quarter: 'last 24 months',
        year: undefined //clears filter
    }

    const handleChange = (granularity:string) => {
        const rts = timeFilters[granularity];
        const timeFilter: TimeRange = {
            to: undefined,
            from: undefined,
            relativeTimeString: rts
        }
        const eventObject = {
            value: granularity,
            dateRange: timeFilter
        }
        props.onChange(eventObject); 
        setGranularity(granularity as Granularity);       
    }

    const granularityOptions = (): GranularityResponse => {
        const data: { value: Granularity }[] = [];
        options.filter(option => props[option])?.forEach((option) => data.push({value: option}) );
        return {
            isLoading: false,
            data: data
        }
    }

    const valueProp: Dimension = {
        __type__: 'dimension',
        name: 'value',
        nativeType: 'string',
        title: 'Value',
    };

    return (
        <Container>
            <div className="flex items-center h-10 ">
                <div className="grow basis-0 h-full">
                    <Dropdown
                        unclearable
                        minDropdownWidth={320}
                        defaultValue={props.defaultValue}
                        options={granularityOptions()}
                        placeholder="Granularity"
                        property={valueProp}
                        onChange={(v) => handleChange(v)}
                    />
                </div>
            </div>
        </Container>
    );
};
