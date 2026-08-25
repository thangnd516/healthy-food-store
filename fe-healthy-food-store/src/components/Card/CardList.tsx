import { IIngredient } from "../../types/typeIngredient";
import { IMeal } from "../../types/typeMeal";
import CardItem from "./CardItem";
interface IProps {
  type: string;
  listIngredients?: IIngredient[];
  listMeals?: IMeal[];
}
const CardList = (props: IProps) => {
  const { type, listIngredients, listMeals } = props;
  return (
    <div className="flex flex-wrap gap-4">
      {type === "ingredient" ? (
        <>
          {listIngredients &&
            listIngredients?.length > 0 &&
            listIngredients?.map((item) => (
              <CardItem type="ingredient" key={item?._id} item={item} />
            ))}
        </>
      ) : type === "meal" ? (
        <>
          {listMeals &&
            listMeals?.length > 0 &&
            listMeals?.map((item) => (
              <CardItem type="meal" key={item?._id} item={item} />
            ))}
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default CardList;
