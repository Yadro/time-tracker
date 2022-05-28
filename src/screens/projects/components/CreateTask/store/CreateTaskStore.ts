import { computed, makeAutoObservable } from 'mobx';

class CreateTaskStore {
  input: string = '';
  inputFocus: boolean = false;
  focusTrigger: boolean = false; // TODO better solution?

  constructor() {
    makeAutoObservable(this);
  }

  setInput(value: string) {
    return (this.input = value);
  }

  applySuggestion(value: string) {
    this.setInput(value);
    this.focusTrigger = !this.focusTrigger;
  }

  clear() {
    return (this.input = '');
  }

  isInputEmpty = computed(() => this.input.length === 0);

  setFocus(isFocus: boolean) {
    this.inputFocus = isFocus;
  }
}

export const createTaskStore = new CreateTaskStore();
