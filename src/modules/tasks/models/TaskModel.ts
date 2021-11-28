import { action, computed, makeObservable, observable } from 'mobx';
import { isSameDay, startOfDay } from 'date-fns';

import AbstractModel from '../../../base/AbstractModel';
import { ITreeItemWithParent } from '../../../types/ITreeItem';

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

export interface IJsonTaskModel extends ITreeItemWithParent {
  children?: IJsonTaskModel[];
  projectId?: string;
  checked?: boolean;
  active?: boolean;
  expanded?: boolean;
  inMyDay?: string;
  time?: string[][] | IJsonTimeRangeModel[];
  datesInProgress?: string[];
  details?: string[];
}

const parseTimeRageItems = (
  timeItems: (string[] | IJsonTimeRangeModel | ITimeRangeModel)[]
) => {
  return timeItems.map(
    (range: string[] | IJsonTimeRangeModel | ITimeRangeModel) => {
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
  );
};

export default class TaskModel extends AbstractModel
  implements ITreeItemWithParent {
  key: string = '';
  title: string = '';
  children?: TaskModel[] = [];
  parent: TaskModel | undefined = undefined;
  projectId: string = '';
  checked: boolean = false;
  active: boolean = false;
  expanded: boolean = true;
  inMyDay: Date | null = null;
  time: ITimeRangeModel[] = [];
  datesInProgress: Date[] = [];
  details: string = '';
  withoutActions: boolean = false; // TODO make a new class

  constructor(props: IJsonTaskModel | TaskModel) {
    super();
    const newProps = {
      ...props,
      children: props.children?.map((json) => new TaskModel(json)) || [],
      time: props.time ? parseTimeRageItems(props.time) : [],
      datesInProgress:
        props.datesInProgress?.map((date) => new Date(date)) || [],
      inMyDay: props?.inMyDay ? new Date(props?.inMyDay) : null,
    };

    this.load(newProps);

    makeObservable(this, {
      key: observable,
      title: observable,
      children: observable,
      // parent: none
      projectId: observable,
      checked: observable,
      active: observable,
      expanded: observable,
      inMyDay: observable,
      time: observable,
      datesInProgress: observable,
      details: observable,
      withoutActions: observable,
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
    const dateNow = new Date();
    this.addDateWhenWasInProgress(dateNow);
    this.time.push({
      start: dateNow,
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
      this.datesInProgress = [...this.datesInProgress, normalDate];
    }
  }
}
