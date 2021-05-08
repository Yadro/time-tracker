import React from 'react';
import { Card } from 'antd';
import format from 'date-fns/format';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';

import { msToTime } from '../../../../../helpers/DateTime';
import { ITimeRangeModel } from '../../../../../models/TaskModel';

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
  onClick: () => void;
}

export default observer(function HoursItem({ range, onClick }: HoursItemProps) {
  const classes = useStyle();

  return (
    <Card className={classes.root} onClick={onClick}>
      <div className={classes.description}>{range.description}</div>
      <div className={classes.button}>
        <div className={classes.hoursRange}>{hoursRangeFormat(range)}</div>
        <div className={classes.duration}>{getDuration(range)}</div>
      </div>
    </Card>
  );
});

const useStyle = createUseStyles({
  root: {
    cursor: 'pointer',

    '& .ant-card-body': {
      padding: 8,
    },
  },
  description: {
    fontSize: 11,
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hoursRange: {
    fontSize: 10,
  },
  duration: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});
