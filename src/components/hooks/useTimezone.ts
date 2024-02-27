import { DataResponse } from '@embeddable.com/react';
import { parse } from 'date-fns';
import { useMemo } from 'react';

export default (props: any) => {
  const update = useMemo(() => {
    return {
      ...props,
      results: fix(props.results),
      prevResults: fix(props.prevResults)
    };

    function fix(results: DataResponse): DataResponse | void {
      if (!results) return;

      return {
        ...results,
        data: results?.data?.map((r) => {
          if (!r[props.xAxis?.name]) return r;

          return {
            ...r,
            [props.xAxis?.name]: parse(
              r[props.xAxis?.name].slice(0, 10),
              'yyyy-MM-dd',
              new Date()
            ).toJSON()
          };
        })
      };
    }
  }, [props]);

  return update;
};
