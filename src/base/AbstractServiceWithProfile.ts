import AbstractFileRepository from './repositories/AbstractFileRepository';
import IService from './IService';

export default abstract class AbstractServiceWithProfile<T>
  implements IService<T> {
  protected repository: AbstractFileRepository | undefined;

  setProfile(profile: string) {
    this.repository?.setProfile(profile);
  }

  abstract getAll(): T;

  abstract save(data: T): void;
}
