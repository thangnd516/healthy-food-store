import { useEffect, useState } from "react";
import { IMeal } from "../types/typeMeal";
import { getAllMeal, getAllMealWithFilter } from "../services/meal";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import defaultImg from "../assets/default-img.png";
import "../styles/stylesMealRecommendPage.scss";
import { Button } from "antd";

const MealsRecommendPage = () => {
  const navigate = useNavigate();
  const [listMealsRecommend, setListMealsRecommend] = useState<IMeal[]>([]);
  const [filterMealRecommend, setFilterMealRecommend] = useState("");
  const fetchDataMealRecommed = async () => {
    if (filterMealRecommend) {
      const response: any = await getAllMealWithFilter(
        1,
        9999,
        filterMealRecommend
      );

      if (response.statusCode === 200) {
        setListMealsRecommend(response.mealData);
      }
    } else {
      const response: any = await getAllMeal(1, 9999);
      if (response.statusCode === 200) {
        setListMealsRecommend(response.mealData);
      }
    }
  };
  useEffect(() => {
    fetchDataMealRecommed();
  }, [filterMealRecommend]);
  return (
    <div className="w-[1000px] mx-auto">
      <div className="mt-5">
        <input
          type="text"
          className="w-full border-2 border-black p-2 outline-none rounded-md focus:border-[#80bd96] transition-all"
          placeholder="Tìm kiếm suất ăn gợi ý..."
          onChange={(e) => setFilterMealRecommend(e.target.value)}
        />
      </div>
      <div className="flex mt-5 meal-recommend-list">
        <Swiper spaceBetween={20} slidesPerView={"auto"} grabCursor={true}>
          {listMealsRecommend?.length > 0 &&
            listMealsRecommend?.map((m: IMeal) => {
              return (
                <>
                  {m?.kind === "mealRecommend" && (
                    <SwiperSlide
                      key={m?._id}
                      className="p-5 rounded-md meal-recommend-item"
                    >
                      <div className="w-full h-[150px]">
                        {m?.image ? (
                          <img
                            src={m?.image}
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
                      <div className="flex flex-col gap-y-1">
                        <span
                          className="inline-block mt-1 text-lg font-semibold cursor-pointer w-max hover:text-[#488a5c] transition-all"
                          onClick={() => navigate(`/meal/${m?._id}`)}
                        >
                          {m?.name}
                        </span>
                        <p className="text-sm ingredient-desc">{m?.desc}</p>
                        <div className="flex items-center gap-x-1">
                          <span>{`Calories: ${m?.calo} gram`}</span>
                        </div>
                        <p className="mt-1 font-medium">{`Giá: ${m?.price?.toLocaleString(
                          "it-IT",
                          {
                            style: "currency",
                            currency: "VND",
                          }
                        )}`}</p>
                      </div>
                      <Button
                        type="primary"
                        className="w-full mt-3"
                        onClick={() => navigate(`/meal/${m?._id}`)}
                      >
                        Đặt hàng
                      </Button>
                    </SwiperSlide>
                  )}
                </>
              );
            })}
        </Swiper>
      </div>
    </div>
  );
};

export default MealsRecommendPage;
