export interface IUser {
  _id: string;
  email: string;
  role: string;
  username: string;
  phoneNumber: string;
  address: string;
  avatar: string;
  cart: {
    meal: {
      _id: string;
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
    _id: number;
  }[];
}
