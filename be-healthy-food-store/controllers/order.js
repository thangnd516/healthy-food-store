const Order = require("../models/order");
const Meal = require("../models/meal");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

const getAllOrder = async (req, res) => {
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
  let queryCommand = Order.find(formatedQueries).populate("userId");
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
    const counts = await Order.find(formatedQueries).countDocuments();
    return res.status(200).json({
      statusCode: response ? 200 : 400,
      orderData: response ? response : "Cannot get Order",
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
};

const getAllOrderWithFilter = asyncHandler(async (req, res) => {
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
  let queryCommand = Order.find(formatedQueries).populate("userId");
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
    const counts = await Order.find(formatedQueries).countDocuments();
    return res.status(200).json({
      statusCode: response ? 200 : 400,
      orderData: response ? response : "Cannot get Order",
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

const updateStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  if (!status) throw new Error("Missing status");
  const dataOrder = await Order.findById(oid);
  const response = await Order.findByIdAndUpdate(
    oid,
    { status },
    { new: true }
  );
  if (status === "Cancelled") {
    for (const product of dataOrder.product) {
      await Meal.findByIdAndUpdate(product.meal._id, {
        $inc: { quantity: product.quantity },
      });
    }
  }
  return res.status(200).json({
    statusCode: response ? 200 : 400,
    rs: response ? response : "Something went wrong",
  });
});

const getIdOrder = async (req, res) => {
  try {
    const data = await historyOrder.findById(req.params.id).populate("userId");
    return res.status(200).json({
      statusCode: 200,
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllOrderByUser = async (req, res) => {
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
  let queryCommand = Order.find({
    userId: req.params.uid,
  }).populate("userId");
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
    const counts = await Order.find({
      userId: req.params.uid,
    }).countDocuments();
    return res.status(200).json({
      statusCode: response ? 200 : 400,
      historyOrder: response ? response : "Cannot get Order",
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
};

module.exports = {
  getAllOrder,
  getAllOrderWithFilter,
  updateStatus,
  getIdOrder,
  getAllOrderByUser,
};
