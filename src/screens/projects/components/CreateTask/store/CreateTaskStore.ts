import { computed, makeAutoObservable } from 'mobx';

class CreateTaskStore {
  input: string = '';
  inputFocus: boolean = false;

  isInputEmpty = computed(() => this.input.length === 0);

  constructor() {
    makeAutoObservable(this);
  }

  setInput(value: string) {
    return (this.input = value);
  }

  afterApplySuggestion() {
    this.clear();
    createTaskStore.setFocus(false);
  }

  clear() {
    return (this.input = '');
  }

  setFocus(isFocus: boolean) {
    this.inputFocus = isFocus;
  }
}

export const createTaskStore = new CreateTaskStore();
