import { action, computed, makeObservable, observable } from 'mobx';
import isSameDay from 'date-fns/isSameDay';

import AbstractModel from '../../../base/AbstractModel';
import { ITreeItem } from '../../../types/ITreeItem';
import { startOfDay } from 'date-fns';

export interface IJsonTimeRangeModel {
  start: string;
  end?: string;
  description?: string;
}

export interface ITimeRangeModel {
  start: Date;
  end?: Date;
  description?: string;
}

interface IJsonTaskModel extends ITreeItem<IJsonTaskModel> {
  projectId: string;
  checked: boolean;
  active: boolean;
  time: string[][] | IJsonTimeRangeModel[];
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
  time: ITimeRangeModel[] = [];
  datesInProgress: Date[] = [];
  details: string = '';

  constructor(props: IJsonTaskModel) {
    super();
    this.load(props);
    this.children = props.children?.map((json) => new TaskModel(json)) || [];
    this.time =
      props.time?.map<ITimeRangeModel>(
        (range: string[] | IJsonTimeRangeModel) => {
          if (Array.isArray(range)) {
            return {
              start: new Date(range[0]),
              end: range[1] ? new Date(range[1]) : undefined,
              description: undefined,
            };
          } else {
            return {
              start: new Date(range.start),
              end: range.end ? new Date(range.end) : undefined,
              description: range.description,
            };
          }
        }
      ) || [];
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
      stop: action,
    });
  }

  get duration() {
    return this.time.reduce((acc: number, range: ITimeRangeModel) => {
      const { start, end } = range;
      const duration = (end ? end.getTime() : Date.now()) - start.getTime();
      return acc + duration;
    }, 0);
  }

  getDurationByDate(date: Date) {
    return this.time.reduce((acc: number, range: ITimeRangeModel) => {
      const { start, end } = range;
      let duration = 0;
      if (isSameDay(start, date)) {
        duration = (end ? end.getTime() : Date.now()) - start.getTime();
      }
      return acc + duration;
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
    this.time.push({
      start: new Date(),
      end: undefined,
      description: undefined,
    });
  }

  stop() {
    if (this.active) {
      this.active = false;
      const range = this.time[this.time.length - 1];
      range.end = new Date();
    }
  }

  wasActiveInDay(date: Date): boolean {
    return this.datesInProgress.some((d) => isSameDay(d, date));
  }

  private addDateWhenWasInProgress(date: Date) {
    const normalDate = startOfDay(date);
    const found = this.datesInProgress.find((d) => isSameDay(d, normalDate));
    if (!found) {
      this.datesInProgress.push(normalDate);
    }
  }
}
