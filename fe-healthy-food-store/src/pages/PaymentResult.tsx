import { Button, Result } from "antd";
import { useEffect, useState } from "react";
import ConFetti from "react-confetti";
import { useNavigate, useSearchParams } from "react-router-dom";
import { paymentDirect } from "../services/payment";
import { useAppDispatch } from "../redux/hook";
import { removeAllMeal } from "../redux/slices/cartSlice";
import { buyMealNow } from "../services/user";

const PaymentResult = () => {
  const [second, _] = useState<number>(5);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [userAuth, setUserAuth] = useState<any>(null);
  const dispatch = useAppDispatch();
  const isBuyNow = JSON.parse(localStorage.getItem("isBuyNow") || "false");
  useEffect(() => {
    const auth: any = localStorage.getItem("auth");
    if (auth) setUserAuth(JSON.parse(auth));
  }, []);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dataPageQuery: string | null = searchParams.get("vnp_ResponseCode");
  const handleWindowResize = () => {
    setWindowWidth(window.innerWidth);
  };
  useEffect(() => {
    if (dataPageQuery == "00") {
      const dataAddress = JSON.parse(localStorage.getItem("address") || "{}");
      const phonenumber = JSON.parse(localStorage.getItem("phone") || "{}");
      const price = JSON.parse(localStorage.getItem("price") || "{}");
      const name = JSON.parse(localStorage.getItem("name") || "{}");
      const listCarts = JSON.parse(localStorage.getItem("product") || "{}");
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
      if (userAuth?.userData?._id) {
        const paymentVNPAY = async () => {
          if (isBuyNow === true) {
            const data: any = {
              price,
              status: "Processing",
              typeOrder: "VNPAY",
              userId: userAuth?.userData?._id,
              name: name,
              phone: phonenumber,
              address: dataAddress,
              product: listCartNew,
            };
            await buyMealNow(data);
          } else {
            await paymentDirect(
              price,
              "VNPAY",
              userAuth?.userData?._id,
              name,
              dataAddress,
              phonenumber,
              listCarts
            );
          }
          dispatch(removeAllMeal());
          localStorage.removeItem("address");
          localStorage.removeItem("phone");
          localStorage.removeItem("price");
          localStorage.removeItem("name");
          localStorage.removeItem("product");
          localStorage.removeItem("buynow");
          localStorage.removeItem("isBuyNow");
        };
        paymentVNPAY();
      }
    }
  }, [dataPageQuery, userAuth?.userData?._id, isBuyNow]);
  const PaymentResult = () => {
    return Number(searchParams.get("vnp_ResponseCode")) == 24 ? (
      <div className="min-h-[100vh] overflow-hidden">
        <ConFetti
          className={`transition-opacity duration-1000 pointer-events-none ${
            second <= 0 ? "opacity-0 " : ""
          }`}
          width={windowWidth}
          height={window.innerHeight}
        />
        <div className="mt-20">
          <div className="mx-auto my-0 bg-white rounded-lg">
            <div className="flex items-center justify-center">
              <Result
                className="bg-white  shadow-lg rounded-xl w-[calc(100%-20px)] md:w-max"
                status="error"
                title="Bạn đã hủy thanh toán giao dịch"
                subTitle="Nếu bạn muốn đặt hàng thì bấm nút bên dưới nhé! 😃"
                extra={[
                  <Button
                    size="large"
                    key="buy"
                    className="hover:!bg-transparent hover:!text-[#D8B979] hover:!border-[#D8B979]"
                    onClick={() => navigate("/")}
                  >
                    Tiếp tục đặt hàng
                  </Button>,
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="min-h-[100vh] overflow-hidden">
        <ConFetti
          className={`transition-opacity duration-1000 pointer-events-none ${
            second <= 0 ? "opacity-0 " : ""
          }`}
          width={windowWidth}
          height={window.innerHeight}
        />
        <div className="mt-20">
          <div className="mx-auto my-0 bg-white rounded-lg">
            <div className="flex items-center justify-center">
              <Result
                className="bg-white  shadow-lg rounded-xl w-[calc(100%-20px)] md:w-max"
                status="success"
                title="Chúc mừng bạn đã đặt hàng thành công 🎉"
                subTitle="Đơn hàng đang được xử lý.Quá trình này sẽ mất 1 chút thời gian,bạn vui lòng đợi nhé!"
                extra={[
                  <Button
                    size="large"
                    key="buy"
                    className="hover:!bg-transparent hover:!text-[#D8B979] hover:!border-[#D8B979]"
                    onClick={() => navigate("/")}
                  >
                    Go back home
                  </Button>,
                ]}
              />
            </div>

            <div className="suggest-products mt-20 max-w-[1140px] mx-auto"></div>
          </div>
        </div>
      </div>
    );
  };
  useEffect(() => {
    window.onresize = () => handleWindowResize();
  }, [second, windowWidth]);

  return PaymentResult();
};

export default PaymentResult;
