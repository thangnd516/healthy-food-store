import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IMeal } from "../types/typeMeal";
import { getMealById } from "../services/meal";
import DetailProduct from "../components/DetailProduct/DetailProduct";

const DetailMealPage = () => {
  const { mid } = useParams();
  const [meal, setMeal] = useState<IMeal | null>(null);
  const fetchDataMealById = async () => {
    if (mid) {
      const response: any = await getMealById(mid);
      if (response?.statusCode === 200) {
        setMeal(response?.mealData);
      }
    }
  };
  useEffect(() => {
    fetchDataMealById();
  }, []);
  return (
    <>
      <DetailProduct kind="meal" meal={meal} />
    </>
  );
};

export default DetailMealPage;
