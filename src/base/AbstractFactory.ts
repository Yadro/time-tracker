// ConstructorParameters<typeof SomeClass>

export default abstract class AbstractFactory {
  create<T>(Model: any, data: any): T {
    return new Model(data);
  }

  createList<M, T>(Model: M, data: any): T[] {
    let items: T[] = [];

    data.forEach((json: any) => {
      items.push(new Model(json));
    });

    return items;
  }
}
