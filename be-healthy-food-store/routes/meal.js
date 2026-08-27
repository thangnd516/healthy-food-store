const router = require("express").Router();
const ctrls = require("../controllers/meal");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");
var multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
  "/createmeal",
  [verifyAccessToken, isAdmin],
  uploader.single("image"),
  ctrls.createMeal,
  upload.single("image")
);
router.post(
  "/createmealrecommend",
  verifyAccessToken,
  ctrls.createMealRecommend
);
router.put(
  "/updatemeal/:mid",
  [verifyAccessToken, isAdmin],
  uploader.single("image"),
  ctrls.updateMeal,
  upload.single("image")
);
router.get("/getallmeal", ctrls.getAllMeal);
router.get("/getmeal/:mid", ctrls.getMeal);
router.get("/getallmealwithfilter", ctrls.getMealWithFilter);
router.delete(
  "/deletemeal/:mid",
  [verifyAccessToken, isAdmin],
  ctrls.deleteMeal
);

module.exports = router;
