const express = require("express");
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");
const categoryController = require("../controllers/categoryController");

const category_route = express();
category_route.use(bodyParser.json());

category_route.use(bodyParser.urlencoded({ extended: true }));

category_route.post("/add-category", auth, categoryController.addCategory);



module.exports = category_route;
