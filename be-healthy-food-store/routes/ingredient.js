const router = require("express").Router();
const ctrls = require("../controllers/ingredient");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");
var multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
  "/createingredient",
  [verifyAccessToken, isAdmin],
  uploader.single("image"),
  ctrls.createIngredient,
  upload.single("image")
);
router.put(
  "/updateingredient/:iid",
  [verifyAccessToken, isAdmin],
  uploader.single("image"),
  ctrls.updateIngredient,
  upload.single("image")
);
router.get("/getallingredient", ctrls.getAllIngredient);
router.get("/getingredientwithfilter", ctrls.getIngredientWithFilter);
router.delete(
  "/deleteingredient/:iid",
  [verifyAccessToken, isAdmin],
  ctrls.deleteIngredient
);
router.get("/getingredient/:iid", ctrls.getIngredient);
router.get(
  "/getingredientwithoutpagination",
  ctrls.getAllIngredientWithoutPagination
);

module.exports = router;
