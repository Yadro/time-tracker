export interface IDraggableItem<
  T extends IDraggableItem = IDraggableItem<any>
> {
  title: string;
  key: string;
  children?: T[];
}
