import AbstractModel from '../base/AbstractModel';
import { ITreeItem } from '../types/ITreeItem';
import { computed, makeObservable, observable } from 'mobx';

interface ITaskModel extends ITreeItem<ITaskModel> {
  projectId: string;
  checked: boolean;
  active: boolean;
  time: number[][];
}

export default class TaskModel extends AbstractModel implements ITaskModel {
  key: string = '';
  title: string = '';
  children: TaskModel[] = [];
  projectId: string = '';
  checked: boolean = false;
  active: boolean = false;
  time: number[][] = [];

  constructor(props: ITaskModel) {
    super();
    this.load(props);
    this.children = props.children?.map((json) => new TaskModel(json)) || [];

    makeObservable(this, {
      key: observable,
      title: observable,
      children: observable,
      projectId: observable,
      checked: observable,
      active: observable,
      time: observable,
      duration: computed,
    });
  }

  get duration() {
    return this.time.reduce((prev: number, range: number[]) => {
      if (range.length > 0) {
        const duration =
          (range.length === 2 ? range[1] : Date.now()) - range[0];
        return prev + duration;
      }
      return 0;
    }, 0);
  }
}
