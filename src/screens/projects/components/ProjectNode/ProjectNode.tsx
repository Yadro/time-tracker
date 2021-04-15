import React, { SyntheticEvent } from 'react';
import { EditOutlined } from '@ant-design/icons';

import './ProjectNode.less';

import ProjectModel from '../../../../models/ProjectModel';
import rootStore from '../../../../services/RootStore';

const {projectStore}  = rootStore;

interface ProjectNodeProps {
  project: ProjectModel;
}

export default function ProjectNode({ project }: ProjectNodeProps) {
  function onClick(e: SyntheticEvent) {
    e.stopPropagation();
    projectStore.setEditableProject(project);
  }

  return (
    <div className="project-node">
      <div>{project.title}</div>
      <EditOutlined className="edit-button" onClick={onClick} />
    </div>
  );
};
