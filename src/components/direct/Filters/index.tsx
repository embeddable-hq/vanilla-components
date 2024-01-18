import { DataResponse } from '@embeddable.com/react';
import React, { useEffect } from 'react';

import useFont from '../../hooks/useFont';
import '../../vanilla/index.css';
import DateFilter from '../DateFilter';
import Dropdown from '../Dropdown';
import { Inputs } from './Filters.emb';

type TimeRange = {
  to?: Date;
  from?: Date;
  relativeTimeString?: string;
};

export type Props = Inputs & {
  onChangeDate: (v?: TimeRange) => void;
  onChangeChannel: (v: any) => void;
  onChangeSite: (v: any) => void;
  channelsOptions: DataResponse;
  sitesOptions: DataResponse;
  sitesDefaultValue?: string;
};

export default (props: Props) => {
  useFont();

  useEffect(() => {
    console.log('Filter props', props);
  }, [props]);

  return (
    <div className={`h-12 flex w-full items-center`}>
      <div className="flex items-center grow 2xl:max-w-2xl 2xl:ml-auto">
        <div className="grow basis-0">
          <Dropdown
            options={props.channelsOptions}
            placeholder="Channel"
            onChange={props.onChangeChannel}
            property={props.channelProperty}
            searchProperty="searchChannel"
          />
        </div>
        <div className="grow basis-0">
          <DateFilter value={props.dateValue} onChange={props.onChangeDate} />
        </div>
        <div className="grow basis-0">
          <Dropdown
            onChange={props.onChangeSite}
            property={props.sitesProperty}
            defaultValue={props.sitesDefaultValue}
            options={props.sitesOptions}
            searchProperty="searchSites"
          />
        </div>
      </div>
    </div>
  );
};
