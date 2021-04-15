import React, { useEffect, useState } from 'react';
import ProjectModel from '../../../../models/ProjectModel';
import { Button, Input, Modal, Space } from 'antd';
import rootStore from '../../../../services/RootStore';
import { DeleteFilled } from '@ant-design/icons';

const { projectStore } = rootStore;

interface EditProjectModalProps {
  project?: ProjectModel;
  onClose: () => void;
}

export default function EditProjectModal({ project }: EditProjectModalProps) {
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    const editProject = projectStore.editProject;
    if (editProject) {
      setTitle(editProject.title);
    }
  }, [projectStore.editProject]);

  useEffect(() => {
    setTitle(project?.title || '');
  }, [project]);

  function handleOk() {
    if (project) {
      projectStore.setTitle(project, title);
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
        <Button icon={<DeleteFilled />} onClick={handleDelete}>
          Delete
        </Button>
      </Space>
    </Modal>
  );
}
