import instance from "../utils/axiosCutomize";

const getAllOrders = (page: number, limit: number) => {
  return instance.get(`api/order/allorder?page=${page}&limit=${limit}`);
};

const getAllOrdersWithFilter = (
  page: number,
  limit: number,
  filter: string
) => {
  return instance.get(
    `api/order/allorder?page=${page}&limit=${limit}&name=${filter}`
  );
};

const updateStatusOrder = (oid: string, status: string) => {
  return instance.put(`api/order/updatestatus/${oid}`, { status });
};

const getOrderByUser = (uid: string, page: number, limit: number) => {
  return instance.get(
    `api/order/getorderbyuser/${uid}?page=${page}&limit=${limit}`
  );
};

export {
  getAllOrders,
  getAllOrdersWithFilter,
  updateStatusOrder,
  getOrderByUser,
};
