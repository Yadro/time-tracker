import React, { useMemo, useState } from 'react';
import { Checkbox, Drawer, Input, Space } from 'antd';
import { observer } from 'mobx-react';
import { ProjectOutlined } from '@ant-design/icons';
import { createUseStyles } from 'react-jss';

import TaskModel from '../../../../models/TaskModel';
import rootStore from '../../../../services/RootStore';
import HoursByTask from '../HoursByTask/HoursByTask';
import IconTile from '../../../../components/IconTile/IconTile';
import Duration from './components/Duration';
import TimeRangeModal from '../../../../components/TimeRangeModal/TimeRangeModal';
import { Undefined } from '../../../../types/CommonTypes';
import TaskTimeItemModel from '../../../../models/TaskTimeItemModel';

const { projectStore } = rootStore;

interface DrawerTaskProps {
  task: TaskModel | undefined;
  visible: boolean;
  onClose: () => void;
}

export default observer(function DrawerTask({
  task,
  visible,
  onClose,
}: DrawerTaskProps) {
  const classes = useStyle();
  const [currentTaskTime, setCurrentTaskTime] = useState<
    Undefined<TaskTimeItemModel>
  >();

  const project = useMemo(() => projectStore.get(task?.projectId || ''), [
    task,
  ]);

  return (
    <Drawer
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
    >
      <Space direction="vertical" className={classes.container}>
        <Checkbox
          onChange={(e) => {
            const { checked } = e.target;
            if (task) {
              task.setChecked(checked);
            }
          }}
          checked={task?.checked}
        >
          Mark as done
        </Checkbox>
        <div className={classes.iconWithValue}>
          <IconTile backgroundColor="#713A91">
            <ProjectOutlined style={{ color: 'white ' }} />
          </IconTile>
          <span className={classes.projectTitle}>{project?.title}</span>
        </div>
        <Input
          value={task?.title}
          placeholder="Task description"
          onChange={(e) => {
            const title = e.target.value;
            if (task) {
              task.setTitle(title);
            }
          }}
        />
        <Input
          value={task?.details}
          placeholder="Details"
          onChange={(e) => {
            const details = e.target.value;
            if (task) {
              task.setDetails(details);
            }
          }}
        />

        <Duration task={task} />

        <HoursByTask
          task={task}
          onClick={(taskItem) => setCurrentTaskTime(taskItem)}
        />
      </Space>
      <TimeRangeModal
        visible={!!currentTaskTime}
        onClose={() => setCurrentTaskTime(undefined)}
        taskTime={currentTaskTime}
      />
    </Drawer>
  );
});

const useStyle = createUseStyles({
  container: {
    width: '100%',
  },
  iconWithValue: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectTitle: {
    paddingLeft: 5,
  },
});
