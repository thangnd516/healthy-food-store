export interface ICart {
  meal: {
    _id: string;
    price: number;
    name: string;
    image: string;
  };
  quantity: number;
  _id: string;
}
