import React, { useState } from 'react';
import { Button, Layout, Space } from 'antd';
import { observer } from 'mobx-react';
import { Key } from 'rc-tree/lib/interface';

import './Projects.less';

import TaskInput from './components/TaskInput';
import rootStore from '../../services/RootStore';
import TreeList from './components/TreeList';
import TaskModel from '../../models/TaskModel';
import ProjectModel from '../../models/ProjectModel';
import ProjectModal from './components/ProjectModal';
import TaskNode from './components/TaskNode/TaskNode';
import DrawerTask from './components/DrawerTask/DrawerTask';

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
      return <TaskNode model={node} />;
    },
  }
);

const ProjectList = TreeList(
  () => projectStore.projects,
  (list: ProjectModel[]) => {
    projectStore.set(list);
  }
);

export default observer(function Projects() {
  const [showProjectModal, setShowProjectModal] = useState<boolean>();
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
      <Sider width={250} className="site-layout-background">
        <Layout style={{ padding: '12px' }}>
          <ProjectList onSelect={handleSelectProject} />
          <Button onClick={handleCreateProject}>Create Project</Button>
        </Layout>
      </Sider>
      <Layout style={{ padding: '24px' }}>
        <Space className="root" direction="vertical">
          <TaskList onSelect={handleSelectTask} />
          <TaskInput />
        </Space>
      </Layout>
      {showProjectModal && (
        <ProjectModal onClose={() => setShowProjectModal(false)} />
      )}
      <DrawerTask
        task={selectedTask}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </Layout>
  );
});
