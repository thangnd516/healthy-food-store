import instance from "../utils/axiosCutomize";

const uploadImageForMeal = (image: string) => {
  const data = new FormData();
  data.append("image", image);
  return instance.post("api/imagemeal/createmealimage", data);
};

export { uploadImageForMeal };
