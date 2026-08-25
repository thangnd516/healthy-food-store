import { useEffect, useState } from "react";
import Heading from "../components/Heading/Heading";
import LogoList from "../components/Logo/LogoList";
import { IIngredient } from "../types/typeIngredient";
import { getAllIngredient } from "../services/ingredient";
import CardList from "../components/Card/CardList";
import { getAllMeal } from "../services/meal";
import { IMeal } from "../types/typeMeal";
import { useNavigate } from "react-router-dom";
import thanksImg from "../assets/TheThanks.png";

const HomePage = () => {
  const navigate = useNavigate();
  const [listIngredients, setListIngredients] = useState<IIngredient[]>([]);
  const [listMeals, setListMeals] = useState<IMeal[]>([]);
  const fetchDataIngredientHomepage = async () => {
    const response: any = await getAllIngredient(1, 4);
    if (response?.ingredientData?.length > 0) {
      setListIngredients(response?.ingredientData);
    }
  };
  const fetchDataMealHomepage = async () => {
    const response: any = await getAllMeal(1, 4);
    if (response?.mealData?.length > 0) {
      setListMeals(response?.mealData);
    }
  };
  useEffect(() => {
    fetchDataIngredientHomepage();
    fetchDataMealHomepage();
  }, []);
  return (
    <div>
      <div className="banner-list w-full h-[450px] mt-5 relative">
        <div className="absolute inset-0 z-10 w-full h-full bg-black bg-opacity-50"></div>
        <img
          src="https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          className="object-cover w-full h-full"
        />
      </div>
      <>
        <Heading title="Cam kết" />
      </>
      <div className="w-[1000px] mx-auto">
        <div>
          <LogoList />
        </div>
      </div>
      <>
        <Heading title="Gợi ý của chúng tôi" />
      </>
      <div className="w-[1000px] mx-auto mt-5">
        <h3 className="text-center text-[#82bfa1] font-semibold text-xl">
          Danh sách thành phần ăn
        </h3>
        <div className="mt-5">
          <span
            className="flex justify-end mb-2 text-sm cursor-pointer text-[#488a5c] hover:text-[#5ca874] font-semibold transition-all"
            onClick={() => navigate("/ingredients")}
          >
            Xem tất cả
          </span>
          <CardList type="ingredient" listIngredients={listIngredients} />
        </div>
        <h3 className="text-center text-[#82bfa1] font-semibold text-xl mt-5">
          Danh sách suất ăn
        </h3>
        <div className="mt-5">
          <span
            className="flex justify-end mb-2 text-sm cursor-pointer text-[#488a5c] hover:text-[#5ca874] font-semibold transition-all"
            onClick={() => navigate("/meals")}
          >
            Xem tất cả
          </span>
          <CardList type="meal" listMeals={listMeals} />
        </div>
        <div className="mt-10 h-[350px]">
          <img
            src={thanksImg}
            alt=""
            className="object-cover w-full h-full rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
