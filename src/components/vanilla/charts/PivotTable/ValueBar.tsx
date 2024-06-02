import React from 'react';
import { COLORS } from '../../../constants';


type Props = {
  displayValueBars?: boolean;
  value: number;
  maxValue:number;
}

export default function ValueBar({ displayValueBars, value, maxValue }: Props) {

  if (!displayValueBars) return null;
  const hex = COLORS[0];

  const barWidth = (value / maxValue) * 50;

  return (
    <div style={{ width: `${barWidth}%`, backgroundColor: `${hex}` }} className={`h-[16px] rounded-sm`}>
    </div>
  );
}
