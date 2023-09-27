const express = require("express");
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");
const commonController = require("../controllers/commonController");

const common_route = express();
common_route.use(bodyParser.json());
common_route.use(bodyParser.urlencoded({ extended: true }));

common_route.get("/data-count", auth, commonController.data_count);
module.exports = common_route;
