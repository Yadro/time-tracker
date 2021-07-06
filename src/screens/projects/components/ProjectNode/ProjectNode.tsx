import React, { SyntheticEvent } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

import ProjectModel from '../../../../models/ProjectModel';
import rootStore from '../../../../modules/RootStore';

const { projectStore } = rootStore;

interface ProjectNodeProps {
  project: ProjectModel;
  active: boolean;
}

const ProjectNode = observer(({ project, active }: ProjectNodeProps) => {
  const classes = useStyle();

  function onClick() {
    projectStore.setActiveProject(project.key);
  }

  function onEditClick(e: SyntheticEvent) {
    e.stopPropagation();
    projectStore.setEditableProject(project);
  }

  return (
    <div
      className={clsx(classes.projectNode, active && classes.active)}
      onClick={onClick}
    >
      <div
        className={classes.projectColor}
        style={{ backgroundColor: project.color }}
      />
      <div className={classes.title}>{project.title}</div>
      <EditOutlined className={classes.editButton} onClick={onEditClick} />
    </div>
  );
});

export default ProjectNode;

const useStyle = createUseStyles({
  projectNode: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    '&:hover $editButton': {
      display: 'inline',
    },
  },
  active: {
    fontWeight: 500,
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
