import { useEffect, useState } from "react";
import { IIngredient } from "../../types/typeIngredient";
import { InputNumberProps } from "antd";
import { InputNumber } from "antd";
import { IMeal } from "../../types/typeMeal";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { createMealToCart } from "../../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { IUser } from "../../types/typeUser";
import ModalNutire from "../Modal/ModalNutire/ModalNutire";
import "../../styles/stylesDetailProduct.scss";
import defaultImg from "../../assets/default-img.png";
import { useNavigate } from "react-router-dom";

interface IProps {
  kind: string;
  ingredient?: IIngredient | null;
  meal?: IMeal | null;
}

type typeUserData = {
  role: string;
  userData: IUser;
};

const DetailProduct = (props: IProps) => {
  const { kind, ingredient, meal } = props;
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState<number>(1);
  const [isShowNature, setIsShowNature] = useState(false);
  const [userAuth, setUserAuth] = useState<typeUserData | null>(null);
  const dispatch = useAppDispatch();
  const isCreated = useAppSelector((state) => state?.cart?.isCreated);
  const [isBuyNow, _] = useState(false);
  const onChange: InputNumberProps["onChange"] = (value) => {
    if (Number(value) > Number(meal?.quantity)) {
      toast.warning("Số lượng không đủ");
      if (value) setQuantity(+value);
      return;
    } else if (typeof value === "number") setQuantity(value);
  };
  const handleBuyNow = () => {
    if (Number(meal?.quantity) < Number(quantity)) {
      toast.warning("Số lượng không đủ");
      return;
    }
    if (!userAuth) {
      toast.warning("Vui lòng đăng nhập");
    } else {
      const dataBuyNow = {
        image: meal?.image,
        nameSp: meal?.name,
        mid: meal?._id,
        quantity,
        price: meal?.price,
      };
      localStorage.setItem("isBuyNow", JSON.stringify(!isBuyNow));
      localStorage.setItem("buynow", JSON.stringify(dataBuyNow));
      navigate("/checkout?isBuyNow=true");
    }
  };
  const handleAddMealToCart = async () => {
    if (Number(meal?.quantity) < Number(quantity)) {
      toast.warning("Số lượng không đủ");
      return;
    }
    if (!userAuth) {
      toast.warning("Vui lòng đăng nhập");
    } else {
      if (meal?._id) {
        const dataMealAddToCart = {
          mid: meal?._id,
          quantity,
          actions: "add",
        };
        dispatch(createMealToCart(dataMealAddToCart));
        isCreated
          ? toast.success("Add meal to cart sucessfully!")
          : toast.success("Add meal to cart fail!");
      }
    }
  };
  useEffect(() => {
    const auth: any = localStorage.getItem("auth");
    if (auth) setUserAuth(JSON.parse(auth));
  }, []);
  return (
    <div className="w-[1000px] mx-auto mt-10">
      <div className="flex gap-x-10">
        <div className="w-[45%] h-[280px]">
          {ingredient?.image || meal?.image ? (
            <img
              src={`${
                kind === "ingredient"
                  ? ingredient?.image
                  : kind === "meal"
                  ? meal?.image
                  : ""
              }`}
              alt=""
              className="object-cover w-full h-full rounded-md"
            />
          ) : (
            <img
              src={defaultImg}
              alt=""
              className="object-cover w-full h-full rounded-md"
            />
          )}
        </div>
        <div className="w-[55%] flex flex-col gap-y-[17px]">
          <div>
            <span className="text-2xl font-semibold">{`${
              kind === "ingredient"
                ? ingredient?.name
                : kind === "meal"
                ? meal?.name
                : ""
            }`}</span>
            {kind === "meal" && (
              <div className="mt-1">
                <p className="flex items-center mb-1 gap-x-[5px]">
                  <span className="text-sm font-semibold">Tình trạng:</span>
                  {meal?.quantity !== 0 ? (
                    <span className="font-semibold text-[#5ca874]">
                      Còn hàng
                    </span>
                  ) : (
                    <span className="font-semibold text-[#fe0000]">
                      Hết hàng
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
          <div className="bg-[#f1f2f3] p-3 flex items-center gap-x-12 rounded-sm">
            <span className="text-sm font-semibold">Giá:</span>
            <span className="text-[#fe0000] text-[22px] font-semibold">
              {kind === "ingredient"
                ? ingredient?.price?.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })
                : kind === "meal"
                ? meal?.price?.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })
                : ""}
            </span>
          </div>
          <div className="flex items-center gap-x-7">
            <span className="text-sm font-semibold">Tiêu đề: </span>
            <span className="text-sm">{`${
              kind === "ingredient"
                ? ingredient?.name
                : kind === "meal"
                ? meal?.name
                : ""
            }`}</span>
          </div>
          {kind === "meal" && (
            <div className="flex items-center gap-x-7">
              <span className="text-sm font-semibold">Số lượng: </span>
              <InputNumber
                min={1}
                value={quantity}
                onChange={onChange}
                className="w-[80px]"
              />
            </div>
          )}

          <div className="flex gap-x-3">
            {kind === "meal" && (
              <>
                <button
                  className="inline-block text-xs w-[33.33%] text-[#fe0000] font-semibold py-2 px-5 border border-[#fe0000] rounded-sm button-buy-now"
                  onClick={() => handleBuyNow()}
                >
                  MUA NGAY
                </button>
                <button
                  className="inline-block text-xs w-[33.33%] text-white font-semibold py-2 px-5 bg-[#fe0000] rounded-sm button-add-to-cart"
                  onClick={handleAddMealToCart}
                >
                  THÊM VÀO GIỎ HÀNG
                </button>
              </>
            )}
            <button
              className="inline-block text-xs w-[33.33%] text-white font-semibold py-2 px-5 bg-[#fe0000] rounded-sm button-detail-product"
              onClick={() => setIsShowNature(!isShowNature)}
            >
              XEM CHI TIẾT DINH DƯỠNG
            </button>
          </div>

          <div>
            <h2 className="pb-1 text-sm font-semibold border-b border-b-gray-500">
              MÔ TẢ SẢN PHẨM
            </h2>
            <div className="flex flex-col mt-3 gap-y-3">
              <div className="flex flex-col gap-y-2">
                <h4 className="font-semibold text-[#5ca874]">CALORIES</h4>
                <span>{`${
                  kind === "ingredient"
                    ? ingredient?.calo
                    : kind === "meal"
                    ? meal?.calo
                    : ""
                } Kcal`}</span>
              </div>
              <div className="flex flex-col gap-y-2">
                <h4 className="font-semibold text-[#5ca874]">
                  SUẤT ĂN NÀY BAO GỒM CÁC THÀNH PHẦN:
                </h4>
                <div className="flex flex-col text-sm gap-y-[2px]">
                  Suất ăn này bao gồm các thành phần:
                  {meal?.ingredients &&
                    meal?.ingredients?.length > 0 &&
                    meal?.ingredients?.map((m: any) => (
                      <p key={m?._id}> - {m?.ingredient?.name}</p>
                    ))}
                </div>
              </div>
              <div className="flex flex-col gap-y-1">
                <h4 className="font-semibold text-[#5ca874]">
                  MÔ TẢ CHI TIẾT SẢN PHẨM
                </h4>
                <p className="mt-1 text-sm">{`${
                  kind === "ingredient"
                    ? ingredient?.desc
                    : kind === "meal"
                    ? meal?.desc
                    : ""
                }`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalNutire
        isShowNature={isShowNature}
        setIsShowNature={setIsShowNature}
        ingredient={ingredient}
        meal={meal}
        kind={kind}
      />
    </div>
  );
};

export default DetailProduct;
