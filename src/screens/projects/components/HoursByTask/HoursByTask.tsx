import React from 'react';
import { Card, Space } from 'antd';
import { BellFilled } from '@ant-design/icons';
import isSameDay from 'date-fns/isSameDay';
import format from 'date-fns/format';

import './HoursByTask.less';

import TaskModel from '../../../../models/TaskModel';
import { mapLastCurrent } from '../../../../helpers/IterateLastCurrent';
import HoursItem from './HoursItem';
import IconTile from '../../../../components/IconTile/IconTile';

function dateFormat(date: Date) {
  return format(date, 'dd.MM.yyyy');
}

interface HoursByTaskProps {
  task: TaskModel | undefined;
}

export default function HoursByTask({ task }: HoursByTaskProps) {
  return (
    <Card className="hours-by-task-container">
      <Space direction="vertical" className="hours-by-task">
        <IconTile backgroundColor="#F5AB28" className="bell">
          <BellFilled style={{ color: 'white' }} />
        </IconTile>
        {task?.time.length === 0 && <div>No billed hours</div>}
        {mapLastCurrent(task?.time || [], (last, range, index) => {
          if (!last || !isSameDay(last.start, range.start)) {
            return (
              <div key={index}>
                <div className="date">{dateFormat(range.start)}</div>
                <HoursItem range={range} />
              </div>
            );
          }
          return <HoursItem key={index} range={range} />;
        })}
      </Space>
    </Card>
  );
}
