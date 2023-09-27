const express = require("express");
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");
const cartController = require("../controllers/cartController");

const cart_route = express();
cart_route.use(bodyParser.json());
cart_route.use(bodyParser.urlencoded({ extended: true }));

cart_route.post("/add-to-cart", auth, cartController.addToCart);

module.exports = cart_route;
