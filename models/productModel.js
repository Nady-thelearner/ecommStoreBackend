const mongoose = require("mongoose");

var product = mongoose.Schema({
  vendor_id: {
    type: String,
    required: true,
  },
  store_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  discount: {
    type: String,
    required: true,
  },
  category_id: {
    type: String,
    required: true,
  },
  subCategory_id: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },

  images: {
    type: Array,
    required: true,
    validate: [arrayLimit, "You can add only 5 images of a product."],
  },
});

function arrayLimit(val) {
  return val.length <= 5;
}

module.exports = mongoose.model("Product", product);
