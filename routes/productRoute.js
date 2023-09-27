const product_controller = require("../controllers/productController");
const express = require("express");
const product_route = express();
const multer = require("multer");
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");

product_route.use(bodyParser.json());
product_route.use(bodyParser.urlencoded({ extended: true }));

const path = require("path");

product_route.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(__dirname, "../public/productImages"),
      (error, success) => {
        if (error) throw error;
      }
    );
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "_" + file.originalname;
    cb(null, name, (error, success) => {
      if (error) throw error;
    });
  },
});

const upload = multer({ storage: storage });

product_route.post(
  "/add-product",
  upload.array("images"),
  auth,
  product_controller.add_Product
);

product_route.get("/get-product", auth, product_controller.get_products);
product_route.get("/search-product", auth, product_controller.search_product);

module.exports = product_route;
