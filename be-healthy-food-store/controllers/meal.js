const Meal = require("../models/meal");
const asyncHandler = require("express-async-handler");

const createMeal = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const nameMeal = await Meal.findOne({ name });
  if (nameMeal) throw new Error("Meal has existed!");
  else {
    const newMeal = await Meal.create(req.body);
    return res.status(200).json({
      statusCode: newMeal ? 200 : 400,
      createdMeal: newMeal ? newMeal : "Cannot create new Meal",
    });
  }
});

const createMealRecommend = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const nameMeal = await Meal.findOne({ name });
  if (nameMeal) throw new Error("Meal has existed!");
  else {
    const newMeal = await Meal.create(req.body);
    return res.status(200).json({
      statusCode: newMeal ? 200 : 400,
      createdMeal: newMeal ? newMeal : "Cannot create new Meal",
    });
  }
});

const updateMeal = asyncHandler(async (req, res) => {
  const { mid } = req.params;
  const image = req?.file?.path;
  if (image) req.body.image = image;
  const updateMeal = await Meal.findByIdAndUpdate(mid, req.body, {
    new: true,
  });
  return res.status(200).json({
    statusCode: updateMeal ? 200 : 400,
    updatedMeal: updateMeal ? updateMeal : "Cannot update Meal",
  });
});

const getAllMeal = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  // Tach cac truong dac biet ra khoi query
  const excludeFiels = ["limit", "sort", "page", "fields"];
  excludeFiels.forEach((item) => delete queries[item]);
  // Format lại các operators cho đúng cú pháp của Mongose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatedQueries = JSON.parse(queryString);
  let queryCommand = Meal.find(formatedQueries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  // Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);
  // Excute query
  queryCommand.exec(async (err, response) => {
    if (err) throw new Error(err.message);
    const counts = await Meal.find(formatedQueries).countDocuments();
    return res.status(200).json({
      statusCode: response ? 200 : 400,
      mealData: response ? response : "Cannot get Meal",
      counts: counts,
      data: {
        meta: {
          total: counts,
          currentPage: page,
          pageSize: +limit,
          pages: Math.ceil(counts / limit),
        },
      },
    });
  });
});

const getMealWithFilter = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  // Tach cac truong dac biet ra khoi query
  const excludeFiels = ["limit", "sort", "page", "fields"];
  excludeFiels.forEach((item) => delete queries[item]);
  // Format lại các operators cho đúng cú pháp của Mongose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatedQueries = JSON.parse(queryString);
  // Filtering
  if (queries?.name)
    formatedQueries.name = { $regex: queries.name, $options: "i" };
  let queryCommand = Meal.find(formatedQueries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  // Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PER_PAGE;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);
  // Excute query
  queryCommand.exec(async (err, response) => {
    if (err) throw new Error(err.message);
    const counts = await Meal.find(formatedQueries).countDocuments();
    return res.status(200).json({
      statusCode: response ? 200 : 400,
      mealData: response ? response : "Cannot get Meal",
      counts: counts,
      data: {
        meta: {
          total: counts,
          currentPage: page,
          pageSize: +limit,
          pages: Math.ceil(counts / limit),
        },
      },
    });
  });
});

const deleteMeal = asyncHandler(async (req, res) => {
  const { mid } = req.params;
  if (!mid) throw new Error("Missing input");
  const response = await Meal.findByIdAndDelete(mid);
  return res.status(200).json({
    statusCode: response ? 200 : 400,
    deletedMeal: response
      ? `Meal with name ${response.name} deleted`
      : "No meal delete",
  });
});

const getMeal = asyncHandler(async (req, res) => {
  const { mid } = req.params;
  const meal = await Meal.findById(mid).populate(
    "ingredients.ingredient",
    "name"
  );
  return res.status(200).json({
    statusCode: meal ? 200 : 400,
    mealData: meal ? meal : "Cannot get Meal",
  });
});

module.exports = {
  createMeal,
  getAllMeal,
  getMealWithFilter,
  deleteMeal,
  updateMeal,
  getMeal,
  createMealRecommend,
};
