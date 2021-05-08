import React, { SyntheticEvent } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';

import ProjectModel from '../../../../models/ProjectModel';
import rootStore from '../../../../services/RootStore';

const { projectStore } = rootStore;

interface ProjectNodeProps {
  project: ProjectModel;
}

export default observer(function ProjectNode({ project }: ProjectNodeProps) {
  const classes = useStyle();

  function onClick(e: SyntheticEvent) {
    e.stopPropagation();
    projectStore.setEditableProject(project);
  }

  return (
    <div className={classes.projectNode}>
      <div>{project.title}</div>
      <EditOutlined className={classes.editButton} onClick={onClick} />
    </div>
  );
});

const useStyle = createUseStyles({
  projectNode: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    '&:hover $editButton': {
      display: 'inline',
    },
  },
  editButton: {
    display: 'none',
  },
});
