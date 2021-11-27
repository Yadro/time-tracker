import TreeModelHelper from './TreeModelHelper';
import TaskFactory from '../modules/tasks/TaskFactory';
import { IJsonTaskModel } from '../modules/tasks/models/TaskModel';
import { TasksByProject } from '../modules/tasks/models/TasksByProject';

describe('TreeModelHelper', () => {
  let testTasks: TasksByProject | undefined;
  beforeEach(() => {
    const factory = new TaskFactory();
    /* Structure:
    -task1
    --task1-1
    ---task-1-1-1
    -task2
    --task21
    --task22
    */
    const task111: Partial<IJsonTaskModel> = {
      key: '111',
      title: 'task1-1-1',
      parent: undefined,
      children: [],
    };
    const task11: Partial<IJsonTaskModel> = {
      key: '11',
      title: 'task1-1',
      parent: undefined,
      children: [task111 as IJsonTaskModel],
    };
    const task1: Partial<IJsonTaskModel> = {
      key: '1',
      title: 'task1',
      parent: undefined,
      children: [task11 as IJsonTaskModel],
    };

    task111.parent = task11 as IJsonTaskModel;
    task11.parent = task1 as IJsonTaskModel;

    const task21: Partial<IJsonTaskModel> = {
      key: '21',
      title: 'task21',
      parent: undefined,
      children: [],
    };
    const task22: Partial<IJsonTaskModel> = {
      key: '22',
      title: 'task22',
      parent: undefined,
      children: [],
    };
    const task2: Partial<IJsonTaskModel> = {
      key: '2',
      title: 'task2',
      parent: undefined,
      children: [task21, task22] as IJsonTaskModel[],
    };
    task21.parent = task2 as IJsonTaskModel;
    task22.parent = task2 as IJsonTaskModel;

    testTasks = factory.createTasks(({
      proj: [task1, task2],
    } as unknown) as TasksByProject);
  });

  test('getPathToNode #1', () => {
    if (!testTasks) {
      throw new Error();
    }
    const task111 = testTasks?.proj?.[0]?.children?.[0]?.children?.[0];
    const result = task111 ? TreeModelHelper.getPathToNode(task111) : undefined;
    expect(result).toStrictEqual(['1', '11', '111']);
  });

  test('getPathToNode #2', () => {
    if (!testTasks) {
      throw new Error();
    }
    const task22 = testTasks?.proj?.[1]?.children?.[0];
    const result = task22 ? TreeModelHelper.getPathToNode(task22) : undefined;
    expect(result).toStrictEqual(['2', '21']);
  });
});
