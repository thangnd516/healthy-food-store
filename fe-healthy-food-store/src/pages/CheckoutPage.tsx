import TableCheckout from "../components/Table/TableCheckout";
import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { buyMealNow, getUser } from "../services/user";
import { IUser } from "../types/typeUser";
import { paymentDirect } from "../services/payment";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../redux/hook";
import { removeAllMeal } from "../redux/slices/cartSlice";
import axios from "axios";

type FieldType = {
  name?: string;
  address?: string;
  phonenumber?: string;
};

type typeUserData = {
  role: string;
  userData: IUser;
};

const CheckoutPage = () => {
  const { TextArea } = Input;
  const [userAuth, setUserAuth] = useState<typeUserData | null>(null);
  const [listCarts, setListCarts] = useState<any>([]);
  const [dataForm, setDataForm] = useState({
    name: "",
    phonenumber: "",
    address: "",
  });
  useEffect(() => {
    const auth: any = localStorage.getItem("auth");
    if (auth) setUserAuth(JSON.parse(auth));
  }, []);
  const [errName, setErrName] = useState("");
  const [errPhoneNumber, serErrPhoneNumber] = useState("");
  const [errAddress, setErrAddress] = useState("");
  const [isRerender, setIsRerender] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [queryParameters] = useSearchParams();
  const dataPageQuery: string | null = queryParameters.get("vnp_ResponseCode");
  const isBuyNow: any = queryParameters.get("isBuyNow");
  const dataBuyNow = JSON.parse(localStorage.getItem("buynow") || "{}");
  const fetchDataUser = async () => {
    if (userAuth?.userData?._id) {
      const response: any = await getUser(userAuth?.userData?._id);
      if (response?.statusCode === 200) {
        if (isBuyNow != null && isBuyNow == "true") {
          setListCarts([dataBuyNow]);
        } else {
          setListCarts(response?.userData?.cart);
        }
      }
    }
  };
  const handleTotalPrice = () => {
    const priceBuyNow =
      Number(dataBuyNow?.price) * Number(dataBuyNow?.quantity);
    let totalPrice = 0;
    for (let i = 0; i < listCarts?.length; i++) {
      totalPrice += listCarts[i]?.quantity * listCarts[i]?.meal?.price;
    }
    return isBuyNow != null && isBuyNow == "true"
      ? Number(priceBuyNow)
      : totalPrice;
  };
  const listCartNew = [
    {
      meal: {
        _id: listCarts[0]?.mid,
        name: listCarts[0]?.nameSp,
        price: listCarts[0]?.price,
        image: listCarts[0]?.image,
      },
      quantity: listCarts[0]?.quantity,
    },
  ];
  const handlePaymentDirect = async (
    price: number,
    name: string,
    address: string,
    phonenumber: string
  ) => {
    if (listCarts?.length <= 0) {
      toast.warning("Bạn không có sản phẩm nào để thanh toán");
      return;
    }
    if (!dataForm?.name || !dataForm?.phonenumber || !dataForm?.address) {
      if (!dataForm?.name) setErrName("Please input your name!");
      if (!dataForm?.phonenumber)
        serErrPhoneNumber("Please input your phone number!");
      if (!dataForm?.address) setErrAddress("Please input your address!");
      return;
    }
    if (isBuyNow !== null && isBuyNow === "true") {
      const data: any = {
        price,
        status: "Processing",
        typeOrder: "CASH",
        userId: userAuth?.userData?._id,
        name: name,
        phone: phonenumber,
        address: address,
        product: listCartNew,
      };
      const response: any = await buyMealNow(data);
      if (response?.statusCode === 200) {
        dispatch(removeAllMeal());
        setIsRerender(!isRerender);
        toast.success("Bạn đã thanh toán trực tiếp thành công!!!");
        setDataForm({
          name: "",
          phonenumber: "",
          address: "",
        });
        localStorage.removeItem("buynow");
        localStorage.removeItem("isBuyNow");
        navigate("/payment-result");
      }
    } else {
      if (userAuth?.userData?._id) {
        const response: any = await paymentDirect(
          price,
          "CASH",
          userAuth?.userData?._id,
          name,
          address,
          phonenumber,
          listCarts
        );
        if (response?.statusCode === 200) {
          dispatch(removeAllMeal());
          setIsRerender(!isRerender);
          toast.success("Bạn đã thanh toán trực tiếp thành công!!!");
          setDataForm({
            name: "",
            phonenumber: "",
            address: "",
          });
          navigate("/payment-result");
        }
      }
    }
  };
  const handlePaymentVNPAY = async () => {
    if (listCarts?.length <= 0) {
      toast.warning("Bạn không có sản phẩm nào để thanh toán");
      return;
    }
    if (!dataForm?.name || !dataForm?.phonenumber || !dataForm?.address) {
      if (!dataForm?.name) setErrName("Please input your name!");
      if (!dataForm?.phonenumber)
        serErrPhoneNumber("Please input your phone number!");
      if (!dataForm?.address) setErrAddress("Please input your address!");
      return;
    }
    const data = { total: handleTotalPrice(), user: userAuth?.userData?._id };
    localStorage.setItem("address", JSON.stringify(dataForm?.address));
    localStorage.setItem("name", JSON.stringify(dataForm?.name));
    localStorage.setItem("phone", JSON.stringify(dataForm?.phonenumber));
    localStorage.setItem("price", JSON.stringify(data.total));
    localStorage.setItem("product", JSON.stringify(listCarts));
    if (userAuth?.userData?._id) {
      const newUrl = await axios.post(
        "http://localhost:9999/create-checkout-vnpay",
        data
      );
      if (newUrl.data.url) {
        window.location.href = newUrl.data.url;
      }
    }
  };

  useEffect(() => {
    fetchDataUser();
  }, [userAuth, isRerender]);
  useEffect(() => {
    if (dataPageQuery == "00") {
      const dataAddress = JSON.parse(localStorage.getItem("address") || "{}");
      const phonenumber = JSON.parse(localStorage.getItem("phone") || "{}");
      const price = JSON.parse(localStorage.getItem("price") || "{}");
      const name = JSON.parse(localStorage.getItem("name") || "{}");
      const listCarts = JSON.parse(localStorage.getItem("product") || "{}");
      if (userAuth?.userData?._id) {
        const paymentVNPAY = async () => {
          await paymentDirect(
            price,
            "VNPAY",
            userAuth?.userData?._id,
            name,
            dataAddress,
            phonenumber,
            listCarts
          );
          dispatch(removeAllMeal());
          setIsRerender(!isRerender);
          localStorage.removeItem("address");
          localStorage.removeItem("phone");
          localStorage.removeItem("price");
          localStorage.removeItem("name");
          localStorage.removeItem("product");
          localStorage.removeItem("buynow");
        };
        paymentVNPAY();
      }
    }
  }, [dataPageQuery, userAuth?.userData?._id, isBuyNow, listCartNew]);
  useEffect(() => {
    if (dataForm?.name) setErrName("");
    if (dataForm?.phonenumber) serErrPhoneNumber("");
    if (dataForm?.address) setErrAddress("");
  }, [dataForm?.name, dataForm?.phonenumber, dataForm?.address]);
  return (
    <div className="w-[800px] mx-auto mt-10">
      <h1 className="mb-3 text-2xl font-semibold">Thông tin đơn hàng</h1>
      <div className="shadow-xl">
        <TableCheckout listCarts={listCarts} />
      </div>
      <h1 className="mt-3 mb-3 text-2xl font-semibold">Thông tin giao hàng</h1>
      <div>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Họ và tên người nhận"
            name="name"
            style={{
              height: "32px",
            }}
          >
            <Input
              placeholder="Vui lòng nhập tên người nhận"
              value={dataForm?.name}
              onChange={(e: any) =>
                setDataForm({ ...dataForm, name: e.target.value })
              }
            />
            {errName && <span className="text-sm text-red-500">{errName}</span>}
          </Form.Item>
          <Form.Item<FieldType>
            label="Số điện thoại"
            name="phonenumber"
            style={{
              height: "32px",
            }}
          >
            <Input
              placeholder="Vui lòng nhập số điện thoại"
              value={dataForm?.phonenumber}
              onChange={(e: any) =>
                setDataForm({ ...dataForm, phonenumber: e.target.value })
              }
            />
            {errPhoneNumber && (
              <span className="text-sm text-red-500">{errPhoneNumber}</span>
            )}
          </Form.Item>
          <Form.Item<FieldType>
            label="Địa chỉ"
            name="address"
            style={{
              height: "100px",
            }}
          >
            <TextArea
              placeholder="Vui lòng nhập địa chỉ"
              autoSize={{ minRows: 4, maxRows: 6 }}
              value={dataForm?.address}
              onChange={(e: any) =>
                setDataForm({ ...dataForm, address: e.target.value })
              }
            />
            {errAddress && (
              <span className="text-sm text-red-500">{errAddress}</span>
            )}
          </Form.Item>
          <div className="flex justify-center translate-x-16 gap-x-3">
            <Button
              type="default"
              typeof="button"
              onClick={() =>
                handlePaymentDirect(
                  handleTotalPrice(),
                  dataForm?.name,
                  dataForm?.address,
                  dataForm?.phonenumber
                )
              }
            >
              Thanh toán tiền mặt
            </Button>
            <Button
              type="primary"
              htmlType="button"
              onClick={() => handlePaymentVNPAY()}
            >
              Thanh toán VNPAY
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CheckoutPage;
