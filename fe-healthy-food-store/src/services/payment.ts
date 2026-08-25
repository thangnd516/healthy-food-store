import { IMeal } from "../types/typeMeal";
import instance from "../utils/axiosCutomize";

const paymentDirect = (
  price: number,
  typeOrder: string,
  userId: string,
  name: string,
  address: string,
  phone: string,
  product: IMeal[]
) => {
  return instance.post("/api/payment/direct", {
    price,
    typeOrder,
    userId,
    name,
    address,
    phone,
    product,
  });
};

export { paymentDirect };
