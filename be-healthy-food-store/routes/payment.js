const router = require("express").Router();
const ctrls = require("../controllers/payment");

router.post("/direct", ctrls.paymentDirect);
router.get("/statistical", ctrls.getStatistical);

module.exports = router;
