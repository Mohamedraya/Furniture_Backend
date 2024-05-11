const router = require("express").Router();
const orderController = require("../controllers/orderController");
const {verifyToken} = require("../middleware/verifyToken");



router.get("/" , verifyToken , orderController.getUserOrders);


module.exports = router;