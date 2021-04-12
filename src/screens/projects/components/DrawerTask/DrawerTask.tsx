import React, { useMemo } from 'react';
import { Checkbox, Drawer, Input, Space } from 'antd';
import { observer } from 'mobx-react';
import { FieldTimeOutlined } from '@ant-design/icons';

import './DrawerTask.less';

import TaskModel from '../../../../models/TaskModel';
import rootStore from '../../../../services/RootStore';
import { useTaskDuration } from '../../../../hooks/TaskHooks';
import HoursByTask from '../HoursByTask/HoursByTask';

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
  const project = useMemo(() => projectStore.get(task?.projectId || ''), [
    task,
  ]);
  const duration = useTaskDuration(task);

  return (
    <Drawer
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
    >
      <Space direction="vertical" className="drawer-task">
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
        <div>Project: {project?.title}</div>
        <Input
          value={task?.title}
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
        <div>
          <FieldTimeOutlined />
          <span>: {duration}</span>
        </div>

        <HoursByTask task={task} />
      </Space>
    </Drawer>
  );
});
