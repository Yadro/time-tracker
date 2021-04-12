import { action, computed, makeObservable, observable } from 'mobx';
import isSameDay from 'date-fns/isSameDay';

import AbstractModel from '../base/AbstractModel';
import { ITreeItem } from '../types/ITreeItem';

interface IJsonTaskModel extends ITreeItem<IJsonTaskModel> {
  projectId: string;
  checked: boolean;
  active: boolean;
  time: string[][];
  datesInProgress: string[];
  children: IJsonTaskModel[];
  details: string[];
}

export default class TaskModel extends AbstractModel {
  key: string = '';
  title: string = '';
  children: TaskModel[] = [];
  projectId: string = '';
  checked: boolean = false;
  active: boolean = false;
  time: Date[][] = [];
  datesInProgress: Date[] = [];
  details: string = '';

  constructor(props: IJsonTaskModel) {
    super();
    this.load(props);
    this.children = props.children?.map((json) => new TaskModel(json)) || [];
    this.time = props.time?.map((range) => range.map((t) => new Date(t))) || [];
    this.datesInProgress =
      props.datesInProgress?.map((date) => new Date(date)) || [];

    makeObservable(this, {
      key: observable,
      title: observable,
      children: observable,
      projectId: observable,
      checked: observable,
      active: observable,
      time: observable,
      datesInProgress: observable,
      details: observable,
      duration: computed,
      setTitle: action,
      setDetails: action,
      start: action,
      end: action,
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

  setTitle(title: string) {
    this.title = title;
  }

  setDetails(details: string) {
    this.details = details;
  }

  setChecked(checked: boolean) {
    this.checked = checked;
  }

  start() {
    this.active = true;
    this.addDateWhenWasInProgress(new Date());
    this.time.forEach((range) => {
      if (range.length === 1) {
        range.push(new Date());
      }
    });
    this.time.push([new Date()]);
  }

  end() {
    if (this.active) {
      this.active = false;
      const range = this.time[this.time.length - 1];
      range.push(new Date());
    }
  }

  wasActiveInDay(date: Date): boolean {
    return this.datesInProgress.some((d) => isSameDay(d, date));
  }

  private addDateWhenWasInProgress(date: Date) {
    const found = this.datesInProgress.find((d) => isSameDay(d, date));
    if (!found) {
      this.datesInProgress.push(date);
    }
  }
}
