import React, { useMemo } from 'react';
import { Checkbox, Drawer, Input, Space } from 'antd';
import { observer } from 'mobx-react';
import { ProjectOutlined } from '@ant-design/icons';

import './DrawerTask.less';

import TaskModel from '../../../../models/TaskModel';
import rootStore from '../../../../services/RootStore';
import HoursByTask from '../HoursByTask/HoursByTask';
import IconTile from '../../../../components/IconTile/IconTile';
import Duration from './components/Duration';

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
        <div className="icon-with-value">
          <IconTile backgroundColor="#713A91">
            <ProjectOutlined style={{ color: 'white ' }} />
          </IconTile>
          <span className="value">{project?.title}</span>
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

        <HoursByTask task={task} />
      </Space>
    </Drawer>
  );
});
