import instance from "../utils/axiosCutomize";

const getAllMeal = (page: number, limit: number) => {
  return instance.get(`api/meal/getallmeal?page=${page}&limit=${limit}`);
};

const getAllMealWithFilter = (page: number, limit: number, filter: string) => {
  return instance.get(
    `api/meal/getallmealwithfilter?page=${page}&limit=${limit}&name=${filter}`
  );
};

const addNewMeal = (data: any, image: string) => {
  return instance.post(`api/meal/createmeal`, {
    ...data,
    image,
  });
};

const addNewMealRecommend = (data: any, image: string) => {
  return instance.post(`api/meal/createmealrecommend`, {
    ...data,
    image,
  });
};

const editMeal = (data: any, image: string, mid: string) => {
  return instance.put(`api/meal/updatemeal/${mid}`, {
    ...data,
    image,
  });
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
