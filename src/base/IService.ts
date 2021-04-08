export default interface IService<T> {
  getAll(): T;
  save(data: T): void;
}
