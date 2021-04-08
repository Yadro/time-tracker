import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Input, Modal } from 'antd';
import rootStore from '../../../services/RootStore';
import ProjectModel from '../../../models/ProjectModel';

interface ProjectModalProps {
  onClose: () => void;
}

export default observer(function ProjectModal({ onClose }: ProjectModalProps) {
  const [projectName, setProjectName] = useState<string>('');

  function handleOk() {
    const { projectStore } = rootStore;
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
      title="Basic Modal"
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
