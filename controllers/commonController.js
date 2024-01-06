const Product = require("../models/productModel");
const Users = require("../models/userModel");
const Category = require("../models/categoryModel");
const Subcategory = require("../models/subCategoriesModel");

const data_count = async (req, res) => {
  try {
    const count_data = [];
    const product_data = await Product.find().count();
    const vendor_data = await Users.find({ type: 1 }).count();
    const category_data = await Category.find().count();
    const subcategory_data = await Subcategory.find().count();

    count_data.push({
      product: product_data,
      vendor: vendor_data,
      category: category_data,
      subcategory: subcategory_data,
    });

    res
      .status(200)
      .send({ success: true, message: "All data count", data: count_data });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  data_count,
};
