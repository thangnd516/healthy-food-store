const router = require("express").Router();
const ctrls = require("../controllers/imagemeal");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");
var multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
  "/createmealimage",
  [verifyAccessToken, isAdmin],
  uploader.single("image"),
  ctrls.createImageForMeal,
  upload.single("image")
);

module.exports = router;
