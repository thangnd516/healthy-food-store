import { useEffect, useState } from "react";
import TableCart from "../components/Table/TableCart";
import { IUser } from "../types/typeUser";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/user";

type typeUserData = {
  role: string;
  userData: IUser;
};

const CartPage = () => {
  const navigate = useNavigate();
  const [userAuth, setUserAuth] = useState<typeUserData | null>(null);
  const [listDataCarts, setListDataCarts] = useState<any>([]);
  const [isLimitQuantity, setIsLimitQuantity] = useState(false);
  const [isRerender, setIsRerender] = useState(false);
  useEffect(() => {
    const auth: any = localStorage.getItem("auth");
    if (auth) setUserAuth(JSON.parse(auth));
  }, []);
  const fetchDataUser = async () => {
    if (userAuth?.userData?._id) {
      const response: any = await getUser(userAuth?.userData?._id);
      if (response?.statusCode === 200) {
        setListDataCarts(response?.userData?.cart);
      }
    }
  };
  useEffect(() => {
    fetchDataUser();
  }, [userAuth, isRerender]);
  return (
    <div className="w-[950px] mx-auto mt-10">
      <h1 className="flex items-center mb-5 text-xl font-semibold gap-x-2">
        <ShoppingCartOutlined />
        Giỏ hàng
      </h1>
      <div className="shadow-xl">
        <TableCart
          listDataCarts={listDataCarts}
          setListDataCarts={setListDataCarts}
          fetchDataUser={fetchDataUser}
          setIsLimitQuantity={setIsLimitQuantity}
          isRerender={isRerender}
          setIsRerender={setIsRerender}
        />
      </div>
      <div className="flex justify-end pr-10 mt-3">
        <Button
          type="primary"
          onClick={() => navigate("/checkout")}
          disabled={isLimitQuantity}
        >
          Thanh toán
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
