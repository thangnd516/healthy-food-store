const router = require("express").Router();
const ctrls = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");
var multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/register", ctrls.register);
router.post("/login", ctrls.login);
router.get("/current", verifyAccessToken, ctrls.getUserCurrent);
router.post("/createuser", [verifyAccessToken, isAdmin], ctrls.createUser);
router.get("/getalluser", [verifyAccessToken, isAdmin], ctrls.getAllUser);
router.get(
  "/getuserwithfilter",
  [verifyAccessToken, isAdmin],
  ctrls.getUserWithFilter
);
router.put("/updateuser/:uid", [verifyAccessToken, isAdmin], ctrls.updateUser);
router.delete(
  "/deleteuser/:uid",
  [verifyAccessToken, isAdmin],
  ctrls.deleteUser
);
router.get("/forgotpassword", ctrls.forgotPassword);
router.put("/changepassword", ctrls.changePassword);
router.put("/addingredientocart", verifyAccessToken, ctrls.addIngredientToCart);
router.put("/addmealtocart", verifyAccessToken, ctrls.addMealToCart);
router.post("/buynow/:id", verifyAccessToken, ctrls.buyNow);
router.put("/addmealrecommend", verifyAccessToken, ctrls.addMealRecommend);
router.delete(
  "/removemealfromcart/:mid",
  verifyAccessToken,
  ctrls.removeMealFromCart
);
router.put(
  "/updateprofile",
  verifyAccessToken,
  uploader.single("avatar"),
  ctrls.updateProfile,
  upload.single("avatar")
);
router.get("/getuser/:uid", verifyAccessToken, ctrls.getUser);
router.get(
  "/removeallmealfromcart",
  verifyAccessToken,
  ctrls.removeAllMealFromCart
);
router.put("/updatepassword", verifyAccessToken, ctrls.updatePassword);

module.exports = router;
