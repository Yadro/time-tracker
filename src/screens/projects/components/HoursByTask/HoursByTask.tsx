import React from 'react';
import { Card, Space } from 'antd';
import { BellFilled } from '@ant-design/icons';
import isSameDay from 'date-fns/isSameDay';
import format from 'date-fns/format';
import { observer } from 'mobx-react';

import './HoursByTask.less';

import TaskModel, { ITimeRangeModel } from '../../../../models/TaskModel';
import { mapLastCurrent } from '../../../../helpers/IterateLastCurrent';
import HoursItem from './components/HoursItem';
import IconTile from '../../../../components/IconTile/IconTile';
import { calcDuration, msToTime } from '../../../../helpers/DateTime';
import TaskTimeModel from '../../../../models/TaskTimeModel';

function dateFormat(date: Date) {
  return format(date, 'dd.MM.yyyy');
}

function getDurationPerDay(timeItems: ITimeRangeModel[], date: Date) {
  const filteredTimeItems = timeItems.filter((t) => isSameDay(t.start, date));
  return msToTime(calcDuration(filteredTimeItems), false);
}

interface HoursByTaskProps {
  task?: TaskModel;
  onClick: (task: TaskTimeModel) => void;
}

export default observer(function HoursByTask({
  task,
  onClick,
}: HoursByTaskProps) {
  return (
    <Card className="hours-by-task-container">
      <Space direction="vertical" className="hours-by-task">
        <IconTile backgroundColor="#F5AB28" className="bell">
          <BellFilled style={{ color: 'white' }} />
        </IconTile>
        {task?.time.length === 0 && <div>No billed hours</div>}
        {mapLastCurrent(task?.time || [], (last, range, index) => {
          const hoursItem = (
            <HoursItem
              range={range}
              onClick={() => {
                console.log(task);
                task && onClick(new TaskTimeModel(task, range, index));
              }}
            />
          );
          if (!last || !isSameDay(last.start, range.start)) {
            const duration = getDurationPerDay(task?.time || [], range.start);
            return (
              <div key={index}>
                <div className="header-date">
                  <div className="date">{dateFormat(range.start)}</div>
                  <div className="duration-date">{duration}</div>
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
