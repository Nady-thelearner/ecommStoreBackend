const express = require("express");
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");
const addressController = require("../controllers/addressController");

const address_route = express();
address_route.use(bodyParser.json());
address_route.use(bodyParser.urlencoded({ extended: true }));

address_route.post("/add-address", auth, addressController.addAddress);
address_route.get("/get-address", auth, addressController.getAddress);

module.exports = address_route;
