
export interface EventModel<T> {
  _id: string;
  _rev?: string;
  type: string;
  date: number;
  data: T;
}
