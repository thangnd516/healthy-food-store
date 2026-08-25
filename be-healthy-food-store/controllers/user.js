const User = require("../models/user");
const Order = require("../models/order");
const Meal = require("../models/meal");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const { sendMail } = require("../utils/sendMail");

const register = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username)
    return res.status(400).json({
      statusCode: 400,
      message: "Missing inputs",
    });
  const userEmail = await User.findOne({ email });
  const userName = await User.findOne({ username });
  if (userEmail || userName) throw new Error("User has existed!");
  else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      statusCode: newUser ? 200 : 400,
      message: newUser ? "Register is successfully!" : "Something went wrong",
    });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      statusCode: 400,
      message: " Missing inputs",
    });
  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    const { password, role, refreshToken, ...userData } = response.toObject();
    const accessToken = generateAccessToken(response._id, role);
    const newRefreshToken = generateRefreshToken(response._id);
    // Luu refresh token vao db
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    // Luu refresh token vao cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      statusCode: 200,
      accessToken,
      userData: {
        userData,
        role,
      },
    });
  } else {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid credentials",
    });
  }
});

const getUserCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  return res.status(200).json({
    statusCode: user ? 200 : 400,
    rs: user ? user : "User not found",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const resetToken = user.createPasswordChangeToken();
  await user.save();

  const html = `Xin vui long click vao link duoi day de thay doi mat khau cua ban. Het han sau 15 phut. <a href=${process.env.URL_SERVER}/reset-password/${resetToken}>Click here<a>`;
  const rs = await sendMail(email, html);
  return res.status(200).json({
    statusCode: rs ? 200 : 400,
    rs,
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("Missing inputs");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid reset token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangeAt = Date.now();
  user.passwordResetExpires = undefined;
  user.save();
  return res.status(200).json({
    statusCode: user ? 200 : 400,
    message: user ? "Update password" : "Something went wrong",
  });
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu cũ không chính xác" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { password: hashedNewPassword },
      { new: true, select: "-password -refreshToken" }
    );
    res.status(200).json({
      statusCode: 200,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

const getAllUser = asyncHandler(async (req, res) => {
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
  let queryCommand = User.find(formatedQueries);
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
    const counts = await User.find(formatedQueries).countDocuments();
    return res.status(200).json({
      statusCode: response ? 200 : 400,
      userData: response ? response : "Cannot get User",
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

const getUserWithFilter = asyncHandler(async (req, res) => {
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
  if (queries?.email)
    formatedQueries.email = { $regex: queries.email, $options: "i" };
  let queryCommand = User.find(formatedQueries);
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
    const counts = await User.find(formatedQueries).countDocuments();
    return res.status(200).json({
      statusCode: response ? 200 : 400,
      userData: response ? response : "Cannot get User",
      counts: counts,
      data: {
        meta: {
          total: counts,
          currentPage: page,
          pageSize: limit,
          pages: Math.ceil(counts / limit),
        },
      },
    });
  });
});

const createUser = asyncHandler(async (req, res) => {
  const { email, password, username, role, phoneNumber, address } = req.body;
  if (!email || !password || !username || !role) {
    return res.status(400).json({
      statusCode: 400,
      message: "Missing inputs",
    });
  }
  const userEmail = await User.findOne({ email });
  const userName = await User.findOne({ username });
  if (userEmail || userName) throw new Error("User has existed!");
  else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      statusCode: newUser ? 200 : 400,
      message: newUser
        ? "Create user is successfully!"
        : "Something went wrong",
    });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  });
  return res.status(200).json({
    statusCode: response ? 200 : 400,
    updatedUser: response ? response : "Something went wrong",
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (!uid) throw new Error("Missing input");
  const response = await User.findByIdAndDelete(uid);
  return res.status(200).json({
    statusCode: response ? 200 : 400,
    deletedUser: response
      ? `User with email ${response.email} deleted`
      : "No user delete",
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id) throw new Error("Missing input");
  const avatar = req?.file?.path;
  if (avatar) req.body.avatar = avatar;
  else req.body.avatar = avatar;
  const response = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password");
  return res.status(200).json({
    statusCode: response ? 200 : 400,
    updatedProfile: response ? response : "Something went wrong",
  });
});

const addIngredientToCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { iid, quantity } = req.body;
  if (!iid || !quantity) throw new Error("Missing input");
  const user = await User.findById(_id).select("cart");
  const alreadyIngredient = user?.cart?.find(
    (el) => el?.ingredient?.toString() === iid
  );
  if (alreadyIngredient) {
    if (alreadyIngredient?.ingredient.toString() === iid) {
      const totalQuantity = alreadyIngredient?.quantity + +quantity;
      const response = await User.updateOne(
        { cart: { $elemMatch: alreadyIngredient } },
        { $set: { "cart.$.quantity": totalQuantity } },
        { new: true }
      );
      return res.status(200).json({
        statusCode: response ? 200 : 400,
        addToCartData: response ? response : "Something went wrong",
      });
    }
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      {
        $push: { cart: { ingredient: iid, quantity } },
      },
      { new: true }
    );
    return res.status(200).json({
      statusCode: response ? 200 : 400,
      addToCartData: response ? response : "Something went wrong",
    });
  }
});

const addMealToCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { mid, quantity, actions } = req.body;
  if (!mid || !quantity) throw new Error("Missing input");
  const user = await User.findById(_id).select("cart");
  const alreadyMeal = user?.cart?.find((el) => el?.meal?.toString() === mid);
  if (alreadyMeal) {
    let totalQuantity = 0;
    if (alreadyMeal?.meal.toString() === mid) {
      if (actions === "add") {
        totalQuantity = alreadyMeal?.quantity + +quantity;
      } else if (actions === "update") {
        totalQuantity = +quantity;
      }
      const response = await User.updateOne(
        { cart: { $elemMatch: alreadyMeal } },
        { $set: { "cart.$.quantity": totalQuantity } },
        { new: true }
      );
      // await Meal.findByIdAndUpdate(
      //   mid,
      //   {
      //     $inc: { quantity: -+quantity },
      //   },
      //   {
      //     runValidators: true,
      //   }
      // );
      return res.status(200).json({
        statusCode: response ? 200 : 400,
        addToCartData: response ? response : "Something went wrong",
      });
    }
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      {
        $push: { cart: { meal: mid, quantity } },
      },
      { new: true }
    );
    // await Meal.findByIdAndUpdate(mid, {
    //   $inc: { quantity: -+quantity },
    // });
    return res.status(200).json({
      statusCode: response ? 200 : 400,
      addToCartData: response ? response : "Something went wrong",
    });
  }
});

const removeMealFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { mid } = req.params;
  const cartResponse = await User.findById(_id, { cart: 1 });
  // const cartResponse2 = cartResponse?.cart?.filter(
  //   (item) => item?.meal?.toString() === mid
  // );
  const response = await User.findByIdAndUpdate(
    _id,
    {
      $pull: { cart: { meal: mid } },
    },
    { new: true }
  ).populate("cart.meal", "name price image");
  // await Meal.findByIdAndUpdate(mid, {
  //   $inc: { quantity: cartResponse2[0]?.quantity },
  // });
  return res.status(200).json({
    statusCode: response ? 200 : 400,
    data: response ? response : "Something wrong",
  });
});

const getUser = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const user = await User.findById(uid).populate(
    "cart.meal",
    "name price image"
  );
  return res.status(200).json({
    statusCode: user ? 200 : 400,
    userData: user ? user : "Cannot get user",
  });
});

const addMealRecommend = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { mid } = req.body;
  const response = await User.findByIdAndUpdate(
    _id,
    {
      $push: { mealRecommend: { meal: mid } },
    },
    { new: true }
  );
  return res.status(200).json({
    statusCode: response ? 200 : 400,
    addMealRecommendData: response ? response : "Something went wrong",
  });
});

const removeAllMealFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const response = await User.findByIdAndUpdate(
    _id,
    { cart: [] },
    { new: true }
  );
  return res.status(200).json({
    statusCode: response ? 200 : 400,
    response: response ? response : "Cannot get user",
  });
});

const buyNow = asyncHandler(async (req, res) => {
  const data = await Order.create({
    price: req.body.price,
    status: req.body.status,
    typeOrder: req.body.typeOrder,
    userId: req.params.id,
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    product: req.body.product,
  });
  for (const item of data.product) {
    await Meal.findByIdAndUpdate(
      item.meal._id,
      {
        $inc: {
          quantity: -item.quantity,
        },
      },
      {
        new: true,
      }
    );
  }
  return res.status(200).json({
    statusCode: 200,
    data,
  });
});

module.exports = {
  register,
  login,
  getUserCurrent,
  createUser,
  updateUser,
  getAllUser,
  deleteUser,
  getUserWithFilter,
  forgotPassword,
  changePassword,
  updateProfile,
  getUser,
  addIngredientToCart,
  addMealToCart,
  removeMealFromCart,
  removeAllMealFromCart,
  addMealRecommend,
  updatePassword,
  buyNow,
};
