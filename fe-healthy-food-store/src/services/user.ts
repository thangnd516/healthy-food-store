import instance from "../utils/axiosCutomize";

const postAddNewUser = (
  email: string,
  password: string,
  username: string,
  phoneNumber: string,
  address: string,
  role: string
) => {
  return instance.post("api/user/createuser", {
    email,
    password,
    username,
    phoneNumber,
    address,
    role,
  });
};

const editUser = (
  idUser: string,
  email: string,
  password: string,
  username: string,
  phoneNumber: string,
  address: string,
  role: string
) => {
  return instance.put(`api/user/updateuser/${idUser}`, {
    email,
    password,
    username,
    phoneNumber,
    address,
    role,
  });
};

const deleteUser = (idUser: string) => {
  return instance.delete(`api/user/deleteuser/${idUser}`);
};

const getAllUser = (page: number, limit: number) => {
  return instance.get(`api/user/getalluser?page=${page}&limit=${limit}`);
};

const getAllUserWithFilter = (page: number, limit: number, filter: string) => {
  return instance.get(
    `api/user/getuserwithfilter?page=${page}&limit=${limit}&email=${filter}`
  );
};

const addMealToCart = (dataMeal: {
  mid: string;
  quantity: number;
  actions: string;
}) => {
  return instance.put(`api/user/addmealtocart`, dataMeal);
};

const buyMealNow = (dataMeal: {
  price: number;
  status: string;
  typeOrder: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  product: any;
}) => {
  return instance.post(`api/user/buynow/${dataMeal.userId}`, dataMeal);
};

const removeMealFromCart = (mid: string) => {
  return instance.delete(`api/user/removemealfromcart/${mid}`);
};

const getUser = (uid: string) => {
  return instance.get(`api/user/getuser/${uid}`);
};

const editProfileUser = (
  avatar: string,
  username: string,
  phoneNumber: string,
  address: string
) => {
  const data = new FormData();
  data.append("avatar", avatar);
  data.append("username", username);
  data.append("phoneNumber", phoneNumber);
  data.append("address", address);
  return instance.put("api/user/updateprofile", data);
};

const forgotPassword = (email: string) => {
  return instance.get(`api/user/forgotpassword?email=${email}`);
};

const resetPassword = (token: string, password: string) => {
  return instance.put("api/user/changepassword", {
    token,
    password,
  });
};

const removeAllProduct = () => {
  return instance.get("api/user/removeallmealfromcart");
};

const changePasswordUser = (oldPassword: string, newPassword: string) => {
  return instance.put("api/user/updatepassword", {
    oldPassword,
    newPassword,
  });
};

export {
  postAddNewUser,
  getAllUser,
  editUser,
  deleteUser,
  getAllUserWithFilter,
  getUser,
  addMealToCart,
  buyMealNow,
  removeMealFromCart,
  editProfileUser,
  forgotPassword,
  resetPassword,
  removeAllProduct,
  changePasswordUser,
};
