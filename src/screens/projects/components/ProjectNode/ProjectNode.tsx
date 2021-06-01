import React, { SyntheticEvent } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';

import ProjectModel from '../../../../models/ProjectModel';
import rootStore from '../../../../modules/RootStore';

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
      <div
        className={classes.projectColor}
        style={{ backgroundColor: project.color }}
      />
      <div className={classes.title}>{project.title}</div>
      <EditOutlined className={classes.editButton} onClick={onClick} />
    </div>
  );
});

const useStyle = createUseStyles({
  projectNode: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    '&:hover $editButton': {
      display: 'inline',
    },
  },
  projectColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  title: {
    flex: 1,
  },
  editButton: {
    display: 'none',
  },
});
