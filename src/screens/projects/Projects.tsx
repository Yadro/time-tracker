import React, { useState } from 'react';
import { Button, Layout, Space } from 'antd';
import { observer } from 'mobx-react';

import TaskInput from './components/TaskInput';
import rootStore from '../../services/RootStore';
import TreeList from './components/TreeList';
import TaskModel from '../../models/TaskModel';
import ProjectModel from '../../models/ProjectModel';
import ProjectModal from './components/ProjectModal';
import { Key } from 'rc-tree/lib/interface';
import './Projects.less';

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
      tasksStore.checkTasks(keys as string[]);
      console.log('Check', keys);
    },
    getDefaultChecked() {
      const taskKeys = tasksStore.getCheckedKeys(projectStore.activeProject);
      console.log('Checked List', taskKeys);
      return taskKeys;
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
  const [createNewProject, setCreateNewProject] = useState<boolean>();
  const [showProjectModal, setShowProjectModal] = useState<boolean>();

  function handleCreateProject() {
    setShowProjectModal(true);
  }

  function handleSelectProject(items: Key[]) {
    console.log(items);
    if (items.length > 0) {
      projectStore.setActiveProject(items[0] as string);
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
          <TaskList />
          <TaskInput />
        </Space>
      </Layout>
      {showProjectModal && (
        <ProjectModal
          onClose={() => setShowProjectModal(false)}
          createNew={createNewProject}
        />
      )}
    </Layout>
  );
});
