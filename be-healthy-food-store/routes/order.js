const router = require("express").Router();
const ctrls = require("../controllers/order");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/allorder", [verifyAccessToken, isAdmin], ctrls.getAllOrder);
router.get(
  "/allorderwithfilter",
  [verifyAccessToken, isAdmin],
  ctrls.getAllOrderWithFilter
);
router.get("/getorderbyuser/:uid", verifyAccessToken, ctrls.getAllOrderByUser);
router.put("/updatestatus/:oid", verifyAccessToken, ctrls.updateStatus);

module.exports = router;
