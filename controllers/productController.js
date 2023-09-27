const Product = require("../models/productModel");
const Store = require("../models/storeModel");
const categoryController = require("../controllers/categoryController");
const storeController = require("../controllers/storeController");

const add_Product = async (req, res) => {
  try {
    var arrImages = [];
    for (let i = 0; i < req.files.length; i++) {
      arrImages[i] = req.files[i].filename;
    }

    const product = new Product({
      vendor_id: req.body.vendor_id,
      store_id: req.body.store_id,
      name: req.body.name,
      price: req.body.price,
      discount: req.body.discount,
      category_id: req.body.category_id,
      subCategory_id: req.body.subCategory_id,
      images: arrImages,
    });

    const prodcutData = await product.save();
    res.status(200).send({
      success: true,
      message: "product added successfully",
      data: prodcutData,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const get_products = async (req, res) => {
  try {
    var send_data = [];
    var cat_data = await categoryController.get_category();
    if (cat_data.length > 0) {
      for (let i = 0; i < cat_data.length; i++) {
        var product_data = [];
        var cat_id = cat_data[i]["_id"].toString();

        var cat_pro = await Product.find({ category_id: cat_id });

        if (cat_pro.length > 0) {
          for (let j = 0; j < cat_pro.length; j++) {
            var store_data = await storeController.get_store(
              cat_pro[j]["store_id"]
            );
            // console.log("category Data", cat_data);
            // console.log("category product", cat_pro);
            product_data.push({
              product_name: cat_pro[j]["name"],
              images: cat_pro[j]["images"],
              price: cat_pro[j]["price"],
              discount: cat_pro[j]["discount"],
              store_address: store_data["address"],
              store_location: store_data["location"],
            });
          }
        }
        send_data.push({
          category: cat_data[i]["category"],
          product: product_data,
        });
      }
      res
        .status(200)
        .send({ success: true, message: "product details", data: send_data });
    } else {
      res.status(200).send({ success: false, message: "No record found" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const search_product = async (req, res) => {
  try {
    var search = req.body.search;
    const prodcutData = await Product.find({
      name: { $regex: ".*" + search + ".*", $options: "i" },
    });
    if (prodcutData.length > 0) {
      res
        .status(200)
        .send({ success: true, message: "product found", data: prodcutData });
    } else {
      res.status(200).send({ success: false, message: "product not found" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  add_Product,
  get_products,
  search_product,
};
