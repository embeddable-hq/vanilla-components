import { DataResponse, Measure } from '@embeddable.com/core';
import { Scale, CoreScaleOptions } from 'chart.js';
import { containsFractions } from '../dataUtils'


export function setYAxisStepSize(
  axis: Scale<CoreScaleOptions>, 
  results:DataResponse | undefined, 
  metrics:Measure[],
  dps:number|undefined
) {
    // Capture the max value for dynamic stepSize calculation
    const yAxisMax = axis.max;
    //Disable fractions unless they exist in the data.
    const yAxisContainsFractions = containsFractions(results, metrics);  
    if (axis.options && 'ticks' in axis.options) {
      (axis.options.ticks as any).stepSize = 
        ((!yAxisContainsFractions && yAxisMax <= 10) || dps === 0) ? 1 : undefined;
    }
  }