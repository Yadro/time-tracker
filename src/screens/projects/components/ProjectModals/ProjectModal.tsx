import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Input, Modal, Space } from 'antd';

import rootStore from '../../../../modules/RootStore';
import ProjectModel from '../../../../models/ProjectModel';
import ChooseColor from './components/ChooseColor';

const { projectStore } = rootStore;

interface ProjectModalProps {
  project?: ProjectModel;
  onClose: () => void;
}

export default observer(function ProjectModal({
  project,
  onClose,
}: ProjectModalProps) {
  const [projectName, setProjectName] = useState<string>('');
  const [color, setColor] = useState<string | undefined>();

  useEffect(() => {
    setProjectName(project?.title || '');
  }, [project]);

  function handleOk() {
    projectStore.add(
      new ProjectModel({
        key: String(Date.now()),
        title: projectName,
        color: color || '',
      })
    );
    onClose();
  }

  function handleCancel() {
    onClose();
  }

  return (
    <Modal
      title="Create project"
      visible
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Create"
    >
      <Space direction="vertical">
        <Input
          placeholder="Project name..."
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <ChooseColor
          activeColor={color}
          onChoose={(color) => setColor(color)}
        />
      </Space>
    </Modal>
  );
});
