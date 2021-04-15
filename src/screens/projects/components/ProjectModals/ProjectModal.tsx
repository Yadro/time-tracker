import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Button, Input, Modal, Space } from 'antd';

import rootStore from '../../../../services/RootStore';
import ProjectModel from '../../../../models/ProjectModel';

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

  useEffect(() => {
    setProjectName(project?.title || '');
  }, [project]);

  function handleOk() {
    projectStore.add(
      new ProjectModel({
        key: String(Date.now()),
        title: projectName,
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
      <Input
        placeholder="Project name..."
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
    </Modal>
  );
});
