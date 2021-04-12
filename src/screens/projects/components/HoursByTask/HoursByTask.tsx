import React from 'react';
import { Space } from 'antd';
import { FieldTimeOutlined } from '@ant-design/icons';
import isSameDay from 'date-fns/isSameDay';
import format from 'date-fns/format';

import './HoursByTask.less';

import TaskModel from '../../../../models/TaskModel';
import { mapLastCurrent } from '../../../../helpers/IterateLastCurrent';
import HoursItem from './HoursItem';

function dateFormat(date: Date) {
  return format(date, 'dd.MM.yyyy');
}

interface HoursByTaskProps {
  task: TaskModel | undefined;
}

export default function HoursByTask({ task }: HoursByTaskProps) {
  return (
    <Space direction="vertical" className="hours-by-task">
      <div>
        <FieldTimeOutlined />
        <span className="label">Hours:</span>
      </div>
      {task?.time.length === 0 && <div>No billed hours</div>}
      {mapLastCurrent(task?.time || [], (last, range) => {
        if (!last || !isSameDay(last[0], range[0])) {
          return (
            <div>
              <div>{dateFormat(range[0])}</div>
              <HoursItem range={range} />
            </div>
          );
        }
        return <HoursItem range={range} />;
      })}
    </Space>
  );
}
