import { useNavigate } from "react-router-dom";
import { IIngredient } from "../../types/typeIngredient";
import "../../styles/stylesCardItem.scss";
import { IMeal } from "../../types/typeMeal";
import defaultImg from "../../assets/default-img.png";
import { Button } from "antd";

interface IProps {
  type: string;
  item: IIngredient | IMeal;
}
const CardItem = (props: IProps) => {
  const { item, type } = props;
  const navigate = useNavigate();
  return (
    <div className="w-[calc(25%-15px)] p-4 bg-white rounded-md shadow-2xl card-item flex flex-col justify-between">
      <div className="w-full h-[150px]">
        <img
          src={item?.image ? item?.image : defaultImg}
          alt=""
          className="object-cover w-full h-full rounded-md"
        />
      </div>
      <div className="flex flex-col gap-y-1">
        <span
          className="inline-block mt-1 text-lg w-full font-semibold cursor-pointer leading-5 hover:text-[#488a5c] transition-all"
          onClick={() => {
            type === "ingredient"
              ? navigate(`/ingredient/${item?._id}`)
              : type === "meal"
              ? navigate(`/meal/${item?._id}`)
              : "";
          }}
        >
          {item?.name}
        </span>
        <p className="text-sm ingredient-desc">{item?.desc}</p>
        <div className="flex items-center gap-x-1">
          <span>{`Calories: ${item?.calo} gram`}</span>
        </div>
        <p className="mt-1 font-medium">{`Giá: ${item?.price?.toLocaleString(
          "it-IT",
          {
            style: "currency",
            currency: "VND",
          }
        )}`}</p>
      </div>
      {type === "meal" && (
        <Button
          type="primary"
          className="w-full mt-3"
          onClick={() => navigate(`/meal/${item?._id}`)}
        >
          Đặt hàng
        </Button>
      )}
    </div>
  );
};
export default CardItem;
