const express = require("express");
const router = express.Router();
const purchasedController = require("../controller/purchased.controller");
const { verifyToken } = require("../middleware/auth");

router.post(
  "/api/create/purchase",
  verifyToken,
  purchasedController.createPurchase
);

router.get(
  "/api/get/purchases",
  verifyToken,
  purchasedController.getPurchasesByUserId
);

module.exports = router;
