import React, { useCallback, useMemo, useState } from 'react';
import { Checkbox, Drawer, Input, Space } from 'antd';
import { observer } from 'mobx-react';
import { ProjectOutlined } from '@ant-design/icons';
import { createUseStyles } from 'react-jss';

import TaskModel from '../../../../modules/tasks/models/TaskModel';
import rootStore from '../../../../modules/RootStore';
import HoursByTask from '../HoursByTask/HoursByTask';
import IconTile from '../../../../components/IconTile';
import Duration from './components/Duration';
import TimeRangeModal from '../../../../components/TimeRangeModal/TimeRangeModal';
import { Undefined } from '../../../../types/CommonTypes';
import TaskTimeItemModel from '../../../../modules/tasks/models/TaskTimeItemModel';
import IModalProps from '../../../../types/IModalProps';
import { PURPLE_COLOR } from '../../../../consts';

const { TextArea } = Input;

const { projectStore } = rootStore;

interface DrawerTaskProps extends IModalProps {
  task?: TaskModel;
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

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const title = e.target.value;
      task?.setTitle(title);
    },
    [task]
  );

  const handleDetailsChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const details = e.target.value;
      task?.setDetails(details);
    },
    [task]
  );

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
          <IconTile backgroundColor={PURPLE_COLOR}>
            <ProjectOutlined style={{ color: 'white ' }} />
          </IconTile>
          <span className={classes.projectTitle}>{project?.title}</span>
        </div>
        <TextArea
          value={task?.title}
          rows={3}
          placeholder="Task description"
          onChange={handleTitleChange}
        />
        <TextArea
          placeholder="Details"
          rows={4}
          value={task?.details}
          onChange={handleDetailsChange}
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
