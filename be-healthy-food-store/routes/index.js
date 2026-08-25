const userRouter = require("./user");
const ingredientRouter = require("./ingredient");
const mealRouter = require("./meal");
const imageMealRouter = require("./imagemeal");
const paymentRouter = require("./payment");
const orderRouter = require("./order");
const { errHandler, notFound } = require("../middlewares/errHandler");

const initRoutes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/ingredient", ingredientRouter);
  app.use("/api/meal", mealRouter);
  app.use("/api/imagemeal", imageMealRouter);
  app.use("/api/payment", paymentRouter);
  app.use("/api/order", orderRouter);

  app.use(notFound);
  app.use(errHandler);
};

module.exports = initRoutes;
