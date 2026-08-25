import { useParams } from "react-router-dom";
import { getIngredientById } from "../services/ingredient";
import { useEffect, useState } from "react";
import { IIngredient } from "../types/typeIngredient";
import DetailProduct from "../components/DetailProduct/DetailProduct";

const DetailIngredientPage = () => {
  const { iid } = useParams();
  const [ingredient, setIngredient] = useState<IIngredient | null>(null);
  const fetchDataIngredientById = async () => {
    if (iid) {
      const response: any = await getIngredientById(iid);
      if (response?.statusCode === 200) {
        setIngredient(response?.ingredientData);
      }
    }
  };
  useEffect(() => {
    fetchDataIngredientById();
  }, [iid]);
  return (
    <>
      <DetailProduct kind="ingredient" ingredient={ingredient} />
    </>
  );
};

export default DetailIngredientPage;
