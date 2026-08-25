import { IUser } from "./typeUser";

export interface IOrder {
  _id: string;
  address: string;
  name: string;
  phone: string;
  price: number;
  status: string;
  typeOrder: string;
  userId: IUser;
  dateOrder: string;
  product: {
    meal: {
      _id: string;
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
  }[];
}
