import React, { FC, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';

import HoursCard from './HoursCard/HoursCard';
import TimeRangeModal from '../../../components/TimeRangeModal/TimeRangeModal';
import { mapCurrentNext } from '../../../helpers/ArrayHelper';
import { msToTime } from '../../../helpers/DateTime';
import { getTimeItems } from '../../../helpers/TaskHelper';
import rootStore from '../../../modules/RootStore';
import { ITimeRangeModel } from '../../../modules/tasks/models/TaskModel';
import TaskTimeItemModel from '../../../modules/tasks/models/TaskTimeItemModel';
import { Undefined } from '../../../types/CommonTypes';

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

type Props = {
  date: Date;
};

const EditableTimeItemsView: FC<Props> = ({ date }: Props) => {
  const classes = useStyles();

  const [currentTaskTime, setCurrentTaskTime] = useState<
    Undefined<TaskTimeItemModel>
  >();

  const timeItems = useMemo(() => {
    const tasks = tasksStore.getTasksByDate(date);
    return getTimeItems(tasks, date);
  }, [tasksStore.tasks, date]);

  return (
    <>
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
      <TimeRangeModal
        visible={!!currentTaskTime}
        onClose={() => setCurrentTaskTime(undefined)}
        taskTime={currentTaskTime}
      />
    </>
  );
};

export default observer(EditableTimeItemsView);

const useStyles = createUseStyles({
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
