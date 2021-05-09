import React, { useState } from 'react';
import { Button, Layout, Space } from 'antd';
import { observer } from 'mobx-react';
import { Key } from 'rc-tree/lib/interface';
import { createUseStyles } from 'react-jss';
import { PlusOutlined } from '@ant-design/icons';

import TaskInput from './components/TaskInput';
import rootStore from '../../services/RootStore';
import TreeList from './components/TreeList';
import TaskModel from '../../models/TaskModel';
import ProjectModel from '../../models/ProjectModel';
import ProjectModal from './components/ProjectModals/ProjectModal';
import TaskNode from './components/TaskNode/TaskNode';
import DrawerTask from './components/DrawerTask/DrawerTask';
import ProjectNode from './components/ProjectNode/ProjectNode';
import EditProjectModal from './components/ProjectModals/EditProjectModal';

const { Sider } = Layout;

const { tasksStore, projectStore } = rootStore;

const TaskList = TreeList(
  () => tasksStore.getTasks(projectStore.activeProject),
  (list: TaskModel[]) => {
    tasksStore.set(projectStore.activeProject, list);
  },
  {
    checkable: true,
    onCheck(keys) {
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

const ProjectList = TreeList(
  () => projectStore.projects,
  (list: ProjectModel[]) => {
    projectStore.set(list);
  },
  {
    titleRender(project: ProjectModel) {
      return <ProjectNode project={project} />;
    },
  }
);

export default observer(function Projects() {
  const classes = useStyles();
  const [showProjectModal, setShowProjectModal] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<TaskModel | undefined>();

  function handleCreateProject() {
    setShowProjectModal(true);
  }

  function handleSelectProject(items: Key[]) {
    if (items.length > 0) {
      projectStore.setActiveProject(items[0] as string);
    }
  }

  function handleSelectTask(items: Key[]) {
    if (items.length > 0) {
      setDrawerVisible(true);
      const task = tasksStore.getTaskByKey(items[0] as string);
      setSelectedTask(task);
    }
  }

  return (
    <Layout>
      <Sider width={250} className={classes.sider}>
        <Layout style={{ padding: '12px' }}>
          <Space direction="vertical">
            <ProjectList onSelect={handleSelectProject} />
            <Button onClick={handleCreateProject} icon={<PlusOutlined />}>
              Create Project
            </Button>
          </Space>
        </Layout>
      </Sider>
      <Layout style={{ padding: '24px' }} className={classes.tasks}>
        <Space className="root" direction="vertical">
          <TaskList onSelect={handleSelectTask} />
          <TaskInput />
        </Space>
      </Layout>
      {showProjectModal && (
        <ProjectModal onClose={() => setShowProjectModal(false)} />
      )}
      <EditProjectModal
        project={projectStore.editProject}
        onClose={() => projectStore.setEditableProject(undefined)}
      />
      <DrawerTask
        task={selectedTask}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </Layout>
  );
});

const useStyles = createUseStyles({
  sider: {
    backgroundColor: '#f0f2f5',
    borderRight: '1px solid #d9d9d9',
  },
  tasks: {
    overflowY: 'auto',
  },
});
