import React, { useCallback, useState } from 'react';
import { Button, Layout, Space } from 'antd';
import { observer } from 'mobx-react';
import { Key } from 'rc-tree/lib/interface';
import { createUseStyles } from 'react-jss';
import { PlusOutlined } from '@ant-design/icons';

import TaskInput from './components/TaskInput';
import rootStore from '../../modules/RootStore';
import TreeList from './components/TreeList';
import TaskModel from '../../modules/tasks/models/TaskModel';
import ProjectModel, {
  DEFAULT_PROJECT_ID,
} from '../../modules/projects/models/ProjectModel';
import ProjectModal from './components/ProjectModals/ProjectModal';
import TaskNode from './components/TaskNode/TaskNode';
import DrawerTask from './components/DrawerTask/DrawerTask';
import ProjectNode from './components/ProjectNode/ProjectNode';
import EditProjectModal from './components/ProjectModals/EditProjectModal';
import { first } from '../../helpers/ArrayHelper';
import clsx from 'clsx';

const { Sider } = Layout;

const { tasksStore, projectStore } = rootStore;

const TaskList = TreeList(
  () => tasksStore.getTasks(projectStore.activeProject),
  (list: TaskModel[]) => {
    tasksStore.set(projectStore.activeProject, list);
  },
  {
    checkable: true,
    isDraggable() {
      return projectStore.activeProject !== DEFAULT_PROJECT_ID.MyDay;
    },
    onExpand(keys: Key[]) {
      tasksStore.markExpanded(projectStore.activeProject, keys as string[]);
    },
    getExpandedKeys() {
      return tasksStore.getExpandedKeys(projectStore.activeProject);
    },
    onCheck(keys: any) {
      tasksStore.checkTasks(projectStore.activeProject, keys as string[]);
    },
    getCheckedKeys() {
      return tasksStore.getCheckedKeys(projectStore.activeProject);
    },
    titleRender(node: TaskModel) {
      return <TaskNode task={node} />;
    },
  }
);

const ProjectList = TreeList<ProjectModel>(
  () => projectStore.projects,
  (list: ProjectModel[]) => {
    projectStore.set(list);
  },
  {
    selectable: false,
    draggable: true,
    titleRender(project: ProjectModel) {
      return (
        <ProjectNode
          project={project}
          active={projectStore.activeProject === project.key}
        />
      );
    },
    onExpand(keys: Key[]) {
      projectStore.markExpanded(keys as string[]);
    },
    getExpandedKeys() {
      return projectStore.getExpandedKeys();
    },
  }
);

function handleSelectProject(items: Key[]) {
  if (items.length > 0) {
    projectStore.setActiveProject(first(items) as string);
  }
}

function clearEditableProject() {
  projectStore.setEditableProject(undefined);
}

function Projects() {
  const style = useStyles();
  const [showProjectModal, setShowProjectModal] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<TaskModel | undefined>();

  function handleCreateProject() {
    setShowProjectModal(true);
  }

  const handleSelectTask = useCallback((items: Key[]) => {
    if (items.length > 0) {
      setDrawerVisible(true);
      const task = tasksStore.getTaskByKey(first(items) as string);
      setSelectedTask(task);
    }
  }, []);
  '';
  const handleCloseDrawer = useCallback(() => {
    setDrawerVisible(false);
  }, []);

  const handleHideProjectModal = useCallback(() => {
    setShowProjectModal(false);
  }, []);

  return (
    <Layout>
      <Sider width={250} className={style.sider}>
        <Layout className={style.padding}>
          <Space direction="vertical">
            <ProjectList onSelect={handleSelectProject} />
            <Button onClick={handleCreateProject} icon={<PlusOutlined />}>
              Project
            </Button>
          </Space>
        </Layout>
      </Sider>
      <Layout className={style.taskList}>
        <div className={style.root}>
          <TaskList onSelect={handleSelectTask} />
          <div className={style.stickyTaskInput}>
            <TaskInput />
          </div>
        </div>
      </Layout>
      {showProjectModal && <ProjectModal onClose={handleHideProjectModal} />}
      <EditProjectModal
        project={projectStore.editProject}
        onClose={clearEditableProject}
      />
      <DrawerTask
        task={selectedTask}
        visible={drawerVisible}
        onClose={handleCloseDrawer}
      />
    </Layout>
  );
}

export default observer(Projects);

const useStyles = createUseStyles({
  sider: {
    backgroundColor: '#f0f2f5',
    borderRight: '1px solid #d9d9d9',
  },
  taskList: {
    overflowY: 'auto',
    padding: '12px 12px 0 12px',
  },
  padding: {
    padding: 12,
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: '100%',
  },
  stickyTaskInput: {
    position: 'sticky',
    bottom: 0,
    padding: '12px 0',
    backgroundColor: '#f0f2f5',
  },
});
