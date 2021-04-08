export default abstract class AbstractModel {
  private getAttributes() {
    return Object.keys(this);
  }

  protected load<T extends any = any>(data: T) {
    if (data) {
      this.getAttributes().forEach((attribute) => {
        if (data.hasOwnProperty(attribute)) {
          // @ts-ignore
          this[attribute] = data[attribute];
        }
      });
    }
  }
}
