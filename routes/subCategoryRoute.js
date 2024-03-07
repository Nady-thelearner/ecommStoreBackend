const express = require("express");
const subcategory_route = express();
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");
const subCategoryController = require("../controllers/subCategoryController");

subcategory_route.use(bodyParser.json());
subcategory_route.use(bodyParser.urlencoded({ extended: true }));

subcategory_route.post("/add-sub-category", auth , subCategoryController.createSubCategory);
subcategory_route.get("/fetch-sub-category", auth , subCategoryController.get_subCategory);
//get_subCategory

module.exports = subcategory_route;
