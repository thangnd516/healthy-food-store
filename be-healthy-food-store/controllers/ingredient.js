const Ingredient = require("../models/ingredient");
const asyncHandler = require("express-async-handler");

const createIngredient = asyncHandler(async (req, res) => {
  const image = req?.file?.path;
  if (image) req.body.image = image;
  // else req.body.image = image;
  const { name } = req.body;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const nameIngredient = await Ingredient.findOne({ name });
  if (nameIngredient) throw new Error("Ingredient has existed!");
  else {
    const newIngredient = await Ingredient.create(req.body);
    return res.status(200).json({
      statusCode: newIngredient ? 200 : 400,
      createdIngredient: newIngredient
        ? newIngredient
        : "Cannot create new Ingredient",
    });
  }
});

const updateIngredient = asyncHandler(async (req, res) => {
  const { iid } = req.params;
  const image = req?.file?.path;
  if (image) req.body.image = image;
  const updateIngredient = await Ingredient.findByIdAndUpdate(iid, req.body, {
    new: true,
  });
  return res.status(200).json({
    statusCode: updateIngredient ? 200 : 400,
    updatedIngredient: updateIngredient
      ? updateIngredient
      : "Cannot update Ingredient",
  });
});

const getAllIngredient = asyncHandler(async (req, res) => {
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
  // let queryCommand = Ingredient.find(formatedQueries);
  let queryCommand = Ingredient.find({
    deletedAt: null,
    formatedQueries,
  });
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
    const counts = await Ingredient.find(formatedQueries).countDocuments();
    return res.status(200).json({
      statusCode: response ? 200 : 400,
      ingredientData: response ? response : "Cannot get Ingredient",
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

const getIngredientWithFilter = asyncHandler(async (req, res) => {
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
  let queryCommand = Ingredient.find(formatedQueries);
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
    const counts = await Ingredient.find(formatedQueries).countDocuments();
    return res.status(200).json({
      statusCode: response ? 200 : 400,
      ingredientData: response ? response : "Cannot get Ingredient",
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

const getIngredient = asyncHandler(async (req, res) => {
  const { iid } = req.params;
  const ingredient = await Ingredient.findById(iid);
  return res.status(200).json({
    statusCode: ingredient ? 200 : 400,
    ingredientData: ingredient ? ingredient : "Cannot get Ingredient",
  });
});

const deleteIngredient = asyncHandler(async (req, res) => {
  const { iid } = req.params;
  if (!iid) throw new Error("Missing input");
  const response = await Ingredient.findByIdAndDelete(iid);
  return res.status(200).json({
    statusCode: response ? 200 : 400,
    deletedIngredient: response
      ? `Ingredient with name ${response.name} deleted`
      : "No Ingredient delete",
  });
});

const getAllIngredientWithoutPagination = asyncHandler(async (req, res) => {
  const response = await Ingredient.find();
  return res.json({
    statusCode: 200,
    ingredientData: response ? response : "Cannot get ingredients",
  });
});

module.exports = {
  createIngredient,
  updateIngredient,
  getAllIngredient,
  getIngredientWithFilter,
  deleteIngredient,
  getIngredient,
  getAllIngredientWithoutPagination,
};
