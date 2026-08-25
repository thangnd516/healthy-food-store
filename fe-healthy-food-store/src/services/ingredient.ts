import instance from "../utils/axiosCutomize";

const addNewIngredient = (
  name: string,
  weight: string,
  price: string,
  calo: string,
  protein: string,
  fat: string,
  satFat: string,
  transFat: string,
  carb: string,
  fiber: string,
  sugar: string,
  cholesterol: string,
  sodium: string,
  calcium: string,
  iron: string,
  zinc: string,
  desc: string,
  image: string
) => {
  const data = new FormData();
  data.append("name", name);
  data.append("weight", weight);
  data.append("price", price);
  data.append("calo", calo);
  data.append("protein", protein);
  data.append("fat", fat);
  data.append("satFat", satFat);
  data.append("transFat", transFat);
  data.append("carb", carb);
  data.append("fiber", fiber);
  data.append("sugar", sugar);
  data.append("cholesterol", cholesterol);
  data.append("sodium", sodium);
  data.append("calcium", calcium);
  data.append("iron", iron);
  data.append("zinc", zinc);
  data.append("desc", desc);
  data.append("image", image);
  return instance.post("api/ingredient/createingredient", data);
};

const editIngredient = (
  iid: string,
  name: string,
  weight: string,
  price: string,
  calo: string,
  protein: string,
  fat: string,
  satFat: string,
  transFat: string,
  carb: string,
  fiber: string,
  sugar: string,
  cholesterol: string,
  sodium: string,
  calcium: string,
  iron: string,
  zinc: string,
  desc: string,
  image: string
) => {
  const data = new FormData();
  data.append("name", name);
  data.append("weight", weight);
  data.append("price", price);
  data.append("calo", calo);
  data.append("protein", protein);
  data.append("fat", fat);
  data.append("satFat", satFat);
  data.append("transFat", transFat);
  data.append("carb", carb);
  data.append("fiber", fiber);
  data.append("sugar", sugar);
  data.append("cholesterol", cholesterol);
  data.append("sodium", sodium);
  data.append("calcium", calcium);
  data.append("iron", iron);
  data.append("zinc", zinc);
  data.append("desc", desc);
  data.append("image", image);
  return instance.put(`api/ingredient/updateingredient/${iid}`, data);
};

const deleteIngredient = (iid: string) => {
  return instance.delete(`api/ingredient/deleteingredient/${iid}`);
};

const getAllIngredient = (page: number, limit: number) => {
  return instance.get(
    `api/ingredient/getallingredient?page=${page}&limit=${limit}`
  );
};

const getAllIngredientWithFilter = (
  page: number,
  limit: number,
  filter: string
) => {
  return instance.get(
    `api/ingredient/getingredientwithfilter?page=${page}&limit=${limit}&name=${filter}`
  );
};

const getIngredientById = (iid: string) => {
  return instance.get(`api/ingredient/getingredient/${iid}`);
};

export {
  addNewIngredient,
  getAllIngredient,
  getAllIngredientWithFilter,
  editIngredient,
  deleteIngredient,
  getIngredientById,
};
