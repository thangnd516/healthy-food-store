const router = require("express").Router();
const ctrls = require("../controllers/meal");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/createmeal", [verifyAccessToken, isAdmin], ctrls.createMeal);
router.post(
  "/createmealrecommend",
  verifyAccessToken,
  ctrls.createMealRecommend
);
router.put("/updatemeal/:mid", [verifyAccessToken, isAdmin], ctrls.updateMeal);
router.get("/getallmeal", ctrls.getAllMeal);
router.get("/getmeal/:mid", ctrls.getMeal);
router.get("/getallmealwithfilter", ctrls.getMealWithFilter);
router.delete(
  "/deletemeal/:mid",
  [verifyAccessToken, isAdmin],
  ctrls.deleteMeal
);

module.exports = router;
