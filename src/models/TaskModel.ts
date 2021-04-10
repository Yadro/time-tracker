import AbstractModel from '../base/AbstractModel';
import { ITreeItem } from '../types/ITreeItem';
import { computed, makeObservable, observable } from 'mobx';

interface IJsonTaskModel extends ITreeItem<IJsonTaskModel> {
  projectId: string;
  checked: boolean;
  active: boolean;
  time: number[][];
}

export default class TaskModel extends AbstractModel {
  key: string = '';
  title: string = '';
  children: TaskModel[] = [];
  projectId: string = '';
  checked: boolean = false;
  active: boolean = false;
  time: Date[][] = [];

  constructor(props: IJsonTaskModel) {
    super();
    this.load(props);
    this.children = props.children?.map((json) => new TaskModel(json)) || [];
    this.time = props.time.map((range) => range.map((t) => new Date(t)));

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
    return this.time.reduce((prev: number, range: Date[]) => {
      if (range.length > 0) {
        const duration =
          (range.length === 2 ? range[1].getTime() : Date.now()) -
          range[0].getTime();
        return prev + duration;
      }
      return prev;
    }, 0);
  }
}
