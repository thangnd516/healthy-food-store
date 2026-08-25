const Order = require("../models/order");
const Meal = require("../models/meal");
const User = require("../models/user");

const paymentDirect = async (req, res) => {
  try {
    const data = req.body;
    for (const checkQuantity of data.product) {
      const data = await Meal.findById(checkQuantity.meal._id);
      if (data.quantity < 1) {
        return res.status(200).json({
          message: "số lượng đã hết",
        });
      }
    }
    const userData = await User.findById(data.userId).populate("cart.meal");
    const dataProduct = [];
    for (const db of userData.cart) {
      dataProduct.push({
        _id: db._id,
        quantity: db.quantity,
        meal: {
          _id: db.meal._id,
          name: db.meal.name,
          price: db.meal.price,
          image: db.meal.image,
        },
      });
    }
    const newOrder = await Order.create({
      status: "Processing",
      price: data.price,
      typeOrder: data.typeOrder,
      userId: data.userId,
      name: data.name,
      address: data.address,
      phone: data.phone,
      product: dataProduct,
    });
    for (const item of newOrder.product) {
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
      newOrder,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getStatistical = async (req, res) => {
  try {
    const { day, week, month, year } = req.query;
    let filter = { status: "Success" };

    const toUTC = (date) =>
      new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    if (day) {
      const date = new Date(day);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      filter.dateOrder = { $gte: date, $lt: nextDate };
    } else if (week) {
      const startDate = new Date(week);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);
      filter.dateOrder = { $gte: startDate, $lt: endDate };
    } else if (month) {
      const startDate = new Date(`${month}-01T00:00:00.000Z`);
      const nextMonth = new Date(startDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      filter.dateOrder = { $gte: startDate, $lt: nextMonth };
    } else if (year) {
      const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
      const nextYear = new Date(startDate);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      filter.dateOrder = { $gte: startDate, $lt: nextYear };
    } else {
      const today = new Date();
      const past7Days = new Date(today);
      past7Days.setDate(today.getDate() - 7);
      filter.dateOrder = { $gte: past7Days, $lt: today };
    }
    const orders = await Order.find(filter).populate("userId");
    const totalRevenue = orders.reduce((sum, order) => sum + order.price, 0);
    return res.status(200).json({
      total: totalRevenue,
      orderInfo: orders,
      filter: filter,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  paymentDirect,
  getStatistical,
};
