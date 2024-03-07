const express = require("express");
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");
const cartController = require("../controllers/cartController");

const cart_route = express();
cart_route.use(bodyParser.json());
cart_route.use(bodyParser.urlencoded({ extended: true }));

cart_route.post("/add-to-cart", auth, cartController.addToCart);

cart_route.get("/get-order-det", auth, cartController.getCartDetVendSpecific);

cart_route.post("/add-productIDs", auth, cartController.addProductIDEncrpted);

cart_route.get("/get-productIDs", auth, cartController.getProductID);

cart_route.post("/del-productIDs", auth, cartController.deleteProductID);

cart_route.post(
  "/update-vend-stat",
  auth,
  cartController.updateCartVendorStatus
);

module.exports = cart_route;
