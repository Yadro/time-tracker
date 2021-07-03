import React from 'react';
import { Card, Space } from 'antd';
import { BellFilled } from '@ant-design/icons';
import isSameDay from 'date-fns/isSameDay';
import format from 'date-fns/format';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';

import TaskModel, { ITimeRangeModel } from '../../../../modules/tasks/models/TaskModel';
import TaskTimeItemModel from '../../../../modules/tasks/models/TaskTimeItemModel';
import { mapPrevCurrent } from '../../../../helpers/MapPrevCurrent';
import HoursItem from './components/HoursItem';
import IconTile from '../../../../components/IconTile/IconTile';
import { calcDuration, msToTime } from '../../../../helpers/DateTime';

function dateFormat(date: Date) {
  return format(date, 'dd.MM.yyyy');
}

function getDurationPerDay(timeItems: ITimeRangeModel[], date: Date) {
  const filteredTimeItems = timeItems.filter((t) => isSameDay(t.start, date));
  return msToTime(calcDuration(filteredTimeItems), false);
}

interface HoursByTaskProps {
  task?: TaskModel;
  onClick: (task: TaskTimeItemModel) => void;
}

export default observer(function HoursByTask({
  task,
  onClick,
}: HoursByTaskProps) {
  const classes = useStyle();

  return (
    <Card className={classes.root}>
      <Space direction="vertical" className={classes.hoursByTask}>
        <IconTile backgroundColor="#F5AB28">
          <BellFilled style={{ color: 'white' }} />
        </IconTile>
        {task?.time.length === 0 && <div>No billed hours</div>}
        {mapPrevCurrent(task?.time || [], (prev, range, index) => {
          const hoursItem = (
            <HoursItem
              range={range}
              onClick={() => {
                if (task) {
                  onClick(new TaskTimeItemModel(task, range, index));
                }
              }}
            />
          );
          if (!prev || !isSameDay(prev.start, range.start)) {
            const duration = getDurationPerDay(task?.time || [], range.start);
            return (
              <div key={index}>
                <div className={classes.headerDate}>
                  <div className={classes.date}>{dateFormat(range.start)}</div>
                  <div className={classes.durationDate}>{duration}</div>
                </div>
                {hoursItem}
              </div>
            );
          }
          return hoursItem;
        })}
      </Space>
    </Card>
  );
});

const useStyle = createUseStyles({
  root: {
    '& > .ant-card-body': {
      borderLeft: '2px solid #F5AB28',
      padding: 8,
    },
  },
  hoursByTask: {
    width: '100%',
  },
  headerDate: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    marginLeft: 8,
    fontSize: 11,
    fontWeight: 'bold',
  },
  durationDate: {
    marginRight: 8,
    fontSize: 11,
    fontWeight: 'bold',
  },
});
