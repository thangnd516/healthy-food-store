import instance from "../utils/axiosCutomize";

const getAllMeal = (page: number, limit: number) => {
  return instance.get(`api/meal/getallmeal?page=${page}&limit=${limit}`);
};

const getAllMealWithFilter = (page: number, limit: number, filter: string) => {
  return instance.get(
    `api/meal/getallmealwithfilter?page=${page}&limit=${limit}&name=${filter}`
  );
};

const buildMealFormData = (data: any, image: any) => {
  const formData = new FormData();
  Object.keys(data || {}).forEach((key) => {
    if (data[key] === undefined || data[key] === null) return;
    if (key === "ingredients") {
      formData.append("ingredients", JSON.stringify(data.ingredients || []));
    } else {
      formData.append(key, data[key]);
    }
  });
  if (image) formData.append("image", image);
  return formData;
};

const addNewMeal = (data: any, image: any) => {
  return instance.post(`api/meal/createmeal`, buildMealFormData(data, image));
};

const addNewMealRecommend = (data: any, image: string) => {
  return instance.post(`api/meal/createmealrecommend`, {
    ...data,
    image,
  });
};

const editMeal = (data: any, image: any, mid: string) => {
  return instance.put(
    `api/meal/updatemeal/${mid}`,
    buildMealFormData(data, image)
  );
};

const deleteMeal = (mid: string) => {
  return instance.delete(`api/meal/deletemeal/${mid}`);
};

const getMealById = (mid: string) => {
  return instance.get(`api/meal/getmeal/${mid}`);
};

export {
  addNewMeal,
  editMeal,
  getAllMeal,
  getAllMealWithFilter,
  deleteMeal,
  getMealById,
  addNewMealRecommend,
};
