import React from 'react';
import { Card } from 'antd';
import format from 'date-fns/format';
import { msToTime } from '../../../../helpers/DateTime';
import { ITimeRangeModel } from '../../../../models/TaskModel';

function hoursFormat(date: Date) {
  return format(date, 'HH:mm');
}

function hoursRangeFormat(range: ITimeRangeModel) {
  if (range.end) {
    return `${hoursFormat(range.start)} - ${hoursFormat(range.end)}`;
  }
  return `${hoursFormat(range.start)} -`;
}

function getDuration(range: ITimeRangeModel): string {
  if (range.end) {
    return msToTime(range.end.getTime() - range.start.getTime(), false);
  }
  return '';
}

interface HoursItemProps {
  range: ITimeRangeModel;
}

export default function HoursItem({ range }: HoursItemProps) {
  return (
    <Card className="hours-item">
      <div className="hours-range">{hoursRangeFormat(range)}</div>
      <div className="flex-1" />
      <div className="duration">{getDuration(range)}</div>
    </Card>
  );
}
