import React, { useMemo, useState } from 'react';
import { Layout, Space } from 'antd';
import { observer } from 'mobx-react';

import rootStore from '../../modules/RootStore';
import HoursCard from './components/HoursCard/HoursCard';
import { getTimeItems } from '../../helpers/TaskHelper';
import SelectDate from '../../components/SelectDate';
import TimeRangeModal from '../../components/TimeRangeModal/TimeRangeModal';
import TaskTimeItemModel from '../../modules/tasks/models/TaskTimeItemModel';
import { Undefined } from '../../types/CommonTypes';
import TotalHours from './components/TotalHours/TotalHours';
import { createUseStyles } from 'react-jss';
import { mapCurrentNext } from '../../helpers/ArrayHelper';
import { ITimeRangeModel } from '../../modules/tasks/models/TaskModel';
import { msToTime } from '../../helpers/DateTime';

const { tasksStore } = rootStore;

function getDiff(
  prev: ITimeRangeModel | undefined,
  next: ITimeRangeModel | undefined
) {
  if (prev?.end && next?.start) {
    return msToTime(next.start.getTime() - prev.end.getTime());
  }

  return '';
}

export default observer(function HoursView() {
  const classes = useStyles();
  const [date, setDate] = useState<Date>(new Date());
  const [currentTaskTime, setCurrentTaskTime] = useState<
    Undefined<TaskTimeItemModel>
  >();

  const tasks = useMemo(() => tasksStore.getTasksByDate(date), [
    tasksStore.tasks,
    date,
  ]);
  const timeItems = getTimeItems(tasks, date);

  return (
    <Layout className={classes.hours}>
      <Space direction="vertical">
        <SelectDate date={date} onChange={setDate} />
        <TotalHours timeItems={timeItems} />
        <div className={classes.cards}>
          {mapCurrentNext(timeItems, (item, next, index) => (
            <div key={index}>
              <HoursCard
                taskTime={item}
                onClick={(taskTime) => setCurrentTaskTime(taskTime)}
              />
              <div className={classes.breakTime}>
                {getDiff(item.time, next?.time)}
              </div>
            </div>
          ))}
        </div>
      </Space>
      <TimeRangeModal
        visible={!!currentTaskTime}
        onClose={() => setCurrentTaskTime(undefined)}
        taskTime={currentTaskTime}
      />
    </Layout>
  );
});

const useStyles = createUseStyles({
  hours: {
    overflowY: 'auto',
    padding: 12,

    '& .ant-space-item': {
      display: 'flex',
      justifyContent: 'center',
    },

    '& .ant-card-body': {
      padding: 8,
    },
  },
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  breakTime: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '0 13px',
    fontSize: 11,
  },
});
