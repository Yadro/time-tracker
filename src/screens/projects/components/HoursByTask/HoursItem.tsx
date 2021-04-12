import React from 'react';
import { Card } from 'antd';
import format from 'date-fns/format';
import { msToTime } from '../../../../helpers/DateTime';

function hoursFormat(date: Date) {
  return format(date, 'HH:mm');
}

function hoursRangeFormat(date: Date[]) {
  if (date.length === 2) {
    return `${hoursFormat(date[0])} - ${hoursFormat(date[1])}`;
  }
  return `${hoursFormat(date[0])} -`;
}

function getDuration(date: Date[]): string {
  if (date.length === 2) {
    return msToTime(date[1].getTime() - date[0].getTime(), false);
  }
  return '';
}

interface HoursItemProps {
  range: Date[];
}

export default function HoursItem({ range }: HoursItemProps) {
  return (
    <Card className="hours-item">
      <div className="hours-range">{hoursRangeFormat(range)}</div>
      <div className="space" />
      <div className="duration">{getDuration(range)}</div>
    </Card>
  );
}
