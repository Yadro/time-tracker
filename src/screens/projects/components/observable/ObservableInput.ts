import { makeAutoObservable } from 'mobx';

export default class ObservableInput {
  value: string = '';
  focusTrigger: boolean = false; // TODO better solution?

  constructor() {
    makeAutoObservable(this);
  }

  set(value: string) {
    return (this.value = value);
  }

  setSuggestion(value: string) {
    this.set(value);
    this.focusTrigger = !this.focusTrigger;
  }

  clear() {
    return (this.value = '');
  }
}
