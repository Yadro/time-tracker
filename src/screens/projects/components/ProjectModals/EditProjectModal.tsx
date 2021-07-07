import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Space } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import { observer } from 'mobx-react';

import ProjectModel from '../../../../modules/projects/models/ProjectModel';
import rootStore from '../../../../modules/RootStore';
import ChooseColor from './components/ChooseColor';

const { projectStore } = rootStore;

interface EditProjectModalProps {
  project?: ProjectModel;
  onClose: () => void;
}

const EditProjectModal = observer(({ project }: EditProjectModalProps) => {
  const [title, setTitle] = useState<string>('');
  const [color, setColor] = useState<string>('');

  useEffect(() => {
    const { editProject } = projectStore;
    if (editProject) {
      setTitle(editProject.title);
      setColor(editProject.color);
    }
  }, []);

  useEffect(() => {
    setTitle(project?.title || '');
  }, [project]);

  function handleOk() {
    if (project) {
      projectStore.setProjectProps(project, title, color);
    }
    onClose();
  }

  function handleCancel() {
    onClose();
  }

  function handleDelete() {
    if (project) {
      rootStore.deleteProject(project);
    }
    onClose();
  }

  function onClose() {
    projectStore.setEditableProject(undefined);
  }

  return (
    <Modal
      title="Edit project"
      visible={!!projectStore.editProject}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Save"
    >
      <Space direction="vertical">
        <Input
          placeholder="Project name..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <ChooseColor
          activeColor={color}
          onChoose={(color) => setColor(color)}
        />
        <Button icon={<DeleteFilled />} onClick={handleDelete}>
          Delete
        </Button>
      </Space>
    </Modal>
  );
});

export default EditProjectModal;
