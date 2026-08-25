const ImageMeal = require("../models/imagemeal");
const asyncHandler = require("express-async-handler");
const createImageForMeal = asyncHandler(async (req, res) => {
  const image = req?.file?.path;
  if (image) req.body.image = image;
  // else req.body.image = image;
  const newImage = await ImageMeal.create(req.body);
  return res.status(200).json({
    statusCode: newImage ? 200 : 400,
    createdImage: newImage ? newImage : "Cannot create new Image",
  });
});
module.exports = {
  createImageForMeal,
};
