import React, { useMemo } from 'react';
import {
  CaretRightFilled,
  DeleteOutlined,
  EnterOutlined,
  PauseOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';

import TaskModel from '../../../../modules/tasks/models/TaskModel';
import rootStore from '../../../../modules/RootStore';
import * as TaskHooks from '../../../../hooks/TaskHooks';
import { Features } from '../../../../config';
import { last } from '../../../../helpers/ArrayHelper';
import { taskLastActiveDateFormat } from '../../../../helpers/DateTime';
import {
  stopPropagation,
  stopPropagationAndRun,
} from '../../../../helpers/StopPropagation';

const { tasksStore } = rootStore;

interface TaskNodeProps {
  task: TaskModel;
}

const QUESTION = <QuestionCircleOutlined style={{ color: 'red' }} />;

export default observer(function TaskNode({ task }: TaskNodeProps) {
  const classes = useStyle();

  const duration = TaskHooks.useTaskDuration(task);

  const lastDateInProgress = useMemo(() => {
    const lastDate = last(task.datesInProgress);
    if (lastDate) {
      return taskLastActiveDateFormat(lastDate);
    }
    return undefined;
  }, [task.datesInProgress]);

  const timeData = useMemo(
    () => [lastDateInProgress, duration].filter(Boolean).join(' / '),
    [lastDateInProgress, duration]
  );

  return (
    <div className={classes.taskNode}>
      <span className={classes.taskTitle}>{task.title}</span>
      <span>{timeData}</span>
      <span className={classes.taskNodeActions}>
        {Features.myDay && (
          <EnterOutlined
            onClick={stopPropagationAndRun(() => tasksStore.addToMyDay(task))}
          />
        )}
        {!task.active ? (
          <CaretRightFilled
            onClick={stopPropagationAndRun(() => tasksStore.startTimer(task))}
          />
        ) : (
          <PauseOutlined
            onClick={stopPropagationAndRun(() => tasksStore.stopTimer())}
          />
        )}
        <Popconfirm
          title="Are you sure to delete this task?"
          onConfirm={stopPropagationAndRun(() => tasksStore.remove(task))}
          onCancel={stopPropagation}
          okText="Yes"
          cancelText="No"
          placement="topRight"
          icon={QUESTION}
        >
          <span onClick={stopPropagation}>
            <DeleteOutlined />
          </span>
        </Popconfirm>
      </span>
    </div>
  );
});

const useStyle = createUseStyles({
  taskNode: {
    display: 'flex',

    '&:hover $taskNodeActions': {
      display: 'inline',
    },
  },
  taskNodeActions: {
    display: 'none',
  },
  taskTitle: {
    flex: 1,
  },
  date: {
    marginRight: 5,
  },
});
